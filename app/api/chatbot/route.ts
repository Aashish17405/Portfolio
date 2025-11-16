import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
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
      return NextResponse.json({ reply: assistant });
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
    } as any;

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

    const data = await res.json();
    const assistant = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ reply: assistant });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
