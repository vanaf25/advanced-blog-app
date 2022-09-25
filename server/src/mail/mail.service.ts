import * as nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {Transporter} from "nodemailer";
class MailService {
    transporter:Transporter<SMTPTransport.SentMessageInfo>
    constructor() {
        this.transporter=nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: +process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    async sendActivationMail(to,name,activationLink){
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject:`Activation account on ${process.env.CLIENT_URL} `,
            text:"",
            html:`
    <div>
        <h1>Hello, ${name}. For activation click on the link</h1>
        <a href="${process.env.SERVER_URL}/auth/activation/${activationLink}">${activationLink}</a>
    </div>
    `
        })
    }
}

export default  MailService
