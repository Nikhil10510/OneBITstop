import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "OneBITstop <onboarding@resend.dev>",
            to: [email],
            subject: title,
            html: body,
        });

        if (error) {
            console.error("Resend API Error:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully:", data?.id);
        return data;
    } catch (error) {
        console.error("mailSender Error:", error);
        throw error;
    }
};

export default mailSender;