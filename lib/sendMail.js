// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const emailWithNodemailer =async(emailInfo) =>{
  if(!emailInfo) return null;
  const response = await Promise.allSettled(
    emailInfo.map(async(data)=>{
      if(data.to && data.subject && data.html){
        const options = {
          from: process.env.SMTP_USERNAME,
          to: data.to,
          subject: data.subject,
          html: data.html
        }
        const sendInfo = await transporter.sendMail(options)
        return sendInfo;

      }else{
        new Promise((reject)=>{
          return reject(
            new Error(`Could not send email, Please check the ${JSON.stringify(data)}`)
          ) 
        })
      }
     
    })
  )
  return response
      // try{
      //   const options = {
      //       from: smtpUserName,
      //       to: emailData.email,
      //       subject: emailData.subject,
      //       html: emailData.html
      //     }
      //   const info = await transporter.sendMail(options)
      //   logger.log('info', info.response)
      // }catch(error){
      //   throw error;
      // }
}


// module.exports = emailWithNodemailer;
export default emailWithNodemailer;