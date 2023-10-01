import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

function isHTML(text) {
    const htmlRegex =
        /<([A-Z][A-Z0-9]*)\b[^>]*>.*<\/\1>|<([A-Z][A-Z0-9]*)\b[^]*\/>/i;
    return htmlRegex.test(text);
}

module.exports = async (to, subject, text, html) => {
    try {
        let mailOptions = {
            from: {
                name: "kali's_api@support",
                address: process.env.EMAIL_USERNAME,
            },
            to,
            subject,
            text,
            html,
        };

        // Send the email
        const sentMail = await transporter.sendMail(mailOptions);
        console.log("Sending Email", subject, "to", to);

        return sentMail;
    } catch (error) {
        throw error;
    }
};
