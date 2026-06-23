import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, title, body) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: "OneBITstop",
                    email: process.env.EMAIL_USER
                },
                to: [{ email }],
                subject: title,
                htmlContent: body
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Brevo API Error:", data);
            throw new Error(data.message || "Failed to send email via Brevo");
        }

        console.log("Email sent successfully via Brevo:", data?.messageId);
        return data;
    } catch (error) {
        console.error("mailSender Error:", error.message);
        throw error;
    }
};

export default mailSender;
