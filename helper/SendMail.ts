import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";

const sendMail = async ({
  to,
  subject,
  message,
  attachments,
}: {
  to: string[];
  subject: string;
  message: string;
  attachments?: Attachment[];
}) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      html: message, // Use 'html' for HTML content
      attachments: attachments,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    console.log(error, "email send error");

    return false;
  }
};
export default sendMail;
