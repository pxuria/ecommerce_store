import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";

export async function POST(req: Request) {
  const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !phone || !subject || !message || !email) {
      return NextResponse.json(
        { error: "تمامی فیلدها الزامی هستند." },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_FROM,
      subject: `پیام از طرف ${name}: ${subject}`,
      text: message,
      html: `
            <h3>پیام جدید از فرم تماس با ما</h3>
            <p><strong>ایمیل:</strong> ${email}</p>
            <p><strong>تلفن:</strong> ${phone}</p>
            <p><strong>موضوع:</strong> ${subject}</p>
            <p><strong>پیام:</strong></p>
            <p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: "پیام شما ارسال شد!",
      info,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json({ error: "خطایی رخ داده است." }, { status: 500 });
  }
}
