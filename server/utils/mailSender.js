import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email,title,body) =>{
    try{
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use SSL
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
            },
        })

        let info = await transporter.sendMail({
            from: `"OneBITstop" <${process.env.EMAIL_USER}>`, // Best format for Gmail
            to: email, 
            subject: title,
            html: body,
        });
        return info;
    }
    catch(error){
        console.error("Nodemailer Error:", error);
        throw error; // Re-throw error so the controller can detect and report it
    }
}


export default mailSender;