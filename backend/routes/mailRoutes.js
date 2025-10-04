import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  let { from, to, subject, content, pdfUrl } = req.body;

  try {
    // Ensure "to" is always an array
    if (!Array.isArray(to)) {
      to = [to];
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from,
      to: to.join(", "), // 👈 send to multiple
      subject,
      text: content,
      attachments: pdfUrl
        ? [
            {
              filename: pdfUrl.split("/").pop(),
              path: pdfUrl,
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
