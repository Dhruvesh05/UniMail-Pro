import express from "express";
import { sendMail } from "../utils/googleAuth.js";
import { supabase } from "../utils/supabaseClient.js"; // create a supabase client file

const router = express.Router();

router.post("/send-email", async (req, res) => {
  let { to, subject, content, pdfFileName } = req.body;

  try {
    if (!Array.isArray(to)) to = [to];

    const attachments = pdfFileName
      ? [
          {
            path: `./uploads/${pdfFileName}`,
            filename: pdfFileName,
          },
        ]
      : [];

    // Send email via Gmail OAuth2
    await sendMail({ to: to.join(","), subject, text: content, attachments });

    // Store in Supabase only after successful send
    const { error: insertError } = await supabase.from("email_records").insert({
      from_user: process.env.GMAIL_USER_EMAIL,
      to_user: to.join(", "),
      subject,
      content,
      pdf_filename: pdfFileName || null,
      sent_date: new Date().toISOString(),
    });

    if (insertError) throw insertError;

    res.json({ success: true, message: "Email sent and recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
