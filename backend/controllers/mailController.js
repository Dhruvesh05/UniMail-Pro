import { sendMail } from "../utils/googleAuth.js";

export const sendBulkMail = async (req, res) => {
  try {
    const { recipients, subject, text, html } = req.body;

    // Loop through recipients
    for (let email of recipients) {
      await sendMail({ to: email, subject, text, html });
    }

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
