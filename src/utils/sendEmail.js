// emailService.js
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, htmlBody, textBody) => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: textBody,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: fromAddress,
    });
};

const run = async (toEmail, subject, message) => {
    // ✅ Styled HTML template
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; padding:20px; background:#f9f9f9; color:#333;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <div style="background:#4CAF50; color:white; padding:15px; text-align:center;">
          <h1 style="margin:0;">Dev Tinder</h1>
        </div>
        <div style="padding:20px;">
          <h2 style="color:#444;">${subject}</h2>
          <p style="font-size:16px; line-height:1.5;">${message}</p>
        </div>
        <div style="background:#f1f1f1; padding:10px; text-align:center; font-size:12px; color:#777;">
          © ${new Date().getFullYear()} Dev Tinder. All rights reserved.
        </div>
      </div>
    </div>
  `;

    // ✅ Fallback plain text
    const textBody = `${subject}\n\n${message}\n\n- Dev Tinder`;

    const sendEmailCommand = createSendEmailCommand(
        toEmail || "vikasvikas988099@gmail.com",
        "vikas@vikasrajput18.com",
        subject,
        htmlBody,
        textBody
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            return caught;
        }
        throw caught;
    }
};

module.exports = { run };
