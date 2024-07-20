import twilio from "twilio";

export const WhatsAppMessage = ({ body, to }: { body: string; to: string }) => {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  client.messages
    .create({
      body: body,
      from: "whatsapp:+14155238886",
      to: `whatsapp:+91${to}`,
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.error("Error sending WhatsApp message:", error));
};
