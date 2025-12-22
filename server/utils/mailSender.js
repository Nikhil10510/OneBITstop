import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email,title,body) =>{
    try{
        let transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            },
            tls: {
        rejectUnauthorized: false, // Essential for Render/Vercel environments
      },
        })

        // Inside mailSender.js
        let info = await transporter.sendMail({
            from: `"OneBITstop" <${process.env.EMAIL_USER}>`, // Best format for Gmail
            to: email, 
            subject: title,
            html: body,
        });
        return info;
    }
    catch(error){
        console.log(error);
    }
}


export default mailSender;