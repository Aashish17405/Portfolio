import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/utils/prisma";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = contactSchema.parse(body);
    const { name, email, subject, message } = parsedData;
    const newMessage = {
      name,
      email,
      subject,
      message,
    };

    // Save to database
    await prisma.contact.create({
      data: newMessage,
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-bottom: 20px; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
              📬 New Contact Form Submission
            </h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1e293b; margin-bottom: 10px;">Contact Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; width: 30%;">
                    Name:
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #e2e8f0;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold;">
                    Email:
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #e2e8f0;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold;">
                    Subject:
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #e2e8f0;">
                    ${subject}
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="margin-top: 20px;">
              <h3 style="color: #1e293b; margin-bottom: 10px;">Message:</h3>
              <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; border-radius: 5px;">
                <p style="margin: 0; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
              <p>This email was sent from your portfolio contact form</p>
              <p>Received at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Received at: ${new Date().toLocaleString()}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
