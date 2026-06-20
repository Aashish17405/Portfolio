import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const SYSTEM_PROMPT = `You are an Expert at answering questions about Aashish Jaini, providing accurate and polite responses.\n\nInstructions:\n1. Respond to inquiries regarding Aashish Jaini with courtesy and politeness.\n2. Provide ALL relevant information about Aashish, ensuring that responses are truthful and based solely on the information available.\n3. If a question asks for information not present in your knowledge, clearly indicate that you do not have that data.\n4. Maintain professionalism throughout the conversation, especially since the context may involve a recruiter in an AI startup/company.`;

function extractTextFromLyzrResponse(data: any) {
  // The Lyzr agent response shape may vary; try common locations
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data.reply) return data.reply;
  if (data.response) return data.response;
  if (data.output_text) return data.output_text;
  if (data.outputs && Array.isArray(data.outputs) && data.outputs.length) {
    // outputs[0].content[0].text is a plausible shape
    try {
      const out = data.outputs[0];
      if (out && out.content && out.content[0] && out.content[0].text)
        return out.content[0].text;
    } catch (e) {
      /* ignore */
    }
  }
  // fallback to JSON string
  return JSON.stringify(data);
}

let ratelimit: Ratelimit | null = null;

function getRateLimiter() {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("⚠️ Upstash Redis env vars missing. Chatbot rate limiting is disabled.");
    return null;
  }

  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(
      Number(process.env.CHATBOT_RATE_LIMIT_REQUESTS || 10),
      (process.env.CHATBOT_RATE_LIMIT_DURATION || "60 s") as any
    ),
    analytics: true,
    prefix: "@upstash/ratelimit/chatbot",
  });

  return ratelimit;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = getRateLimiter();

    if (limiter) {
      const { success, limit, reset, remaining } = await limiter.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    }

    const body = await req.json();
    const { message, history } = body || {};

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    // Prefer LYZR agent if API key is provided via env
    const LYZR_KEY = process.env.LYZR_API_KEY || process.env.LYZR_AGENT_API_KEY;
    if (LYZR_KEY) {
      const agent_id = process.env.LYZR_AGENT_ID || "6910378800314db53fb681cb";
      const user_id = process.env.LYZR_USER_ID || "anonymous@local";
      const session_id =
        process.env.LYZR_SESSION_ID || `${agent_id}-${Date.now()}`;

      const payload = {
        user_id,
        agent_id,
        session_id,
        message,
      };

      const res = await fetch(
        "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": LYZR_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
          { error: "LYZR upstream error", details: text },
          { status: 502 }
        );
      }

      const data = await res.json();
      const assistant = extractTextFromLyzrResponse(data) || "";

      // Stream the static response back chunk by chunk to simulate streaming
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send words with small delays to mimic streaming
          const words = assistant.split(" ");
          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i === words.length - 1 ? "" : " ");
            controller.enqueue(encoder.encode(word));
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }

    // Fallback to OpenAI Chat Completions if no Lyzr key present
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return NextResponse.json(
        {
          error: "Server missing API key. Set LYZR_API_KEY or OPENAI_API_KEY.",
        },
        { status: 500 }
      );
    }

    // Build messages array: system, previous conversation, new user message
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.from === "user")
          messages.push({ role: "user", content: item.text });
        else messages.push({ role: "assistant", content: item.text });
      }
    }

    messages.push({ role: "user", content: message });

    const payload = {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: Number(process.env.OPENAI_TEMPERATURE || 0.7),
      top_p: Number(process.env.OPENAI_TOP_P || 0.9),
      max_tokens: 800,
      stream: true,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "OpenAI upstream error", details: text },
        { status: 502 }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            // Keep the last partial line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const cleanLine = line.trim();
              if (!cleanLine) continue;
              if (cleanLine === "data: [DONE]") continue;

              if (cleanLine.startsWith("data: ")) {
                try {
                  const jsonStr = cleanLine.substring(6);
                  const parsed = JSON.parse(jsonStr);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  // Ignore parse errors for malformed lines
                }
              }
            }
          }
          // Process any remaining buffer
          if (buffer && buffer.startsWith("data: ")) {
            try {
              const jsonStr = buffer.substring(6).trim();
              if (jsonStr !== "[DONE]") {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              }
            } catch (e) {
              // Ignore
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
