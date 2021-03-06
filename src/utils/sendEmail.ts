"use strict";
import fs from 'fs';
import { JSDOM } from 'jsdom';
import nodemailer from 'nodemailer';
import path from 'path';
import { env } from '../env.config';

export const sendFakeEmail = async (email: string, isEmail: boolean, url: string) => {

    const testAccount = await nodemailer.createTestAccount()
    console.log("confirmation url: " + url);
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let htmlDOM

    if (isEmail)
        htmlDOM = new JSDOM(await fs.promises.readFile(path.join(__dirname, '../public/confEmail.html'), 'utf8'))
    else
        htmlDOM = new JSDOM(await fs.promises.readFile(path.join(__dirname, '../public/forgotPassword.html'), 'utf8'))

    let atag = htmlDOM.window.document.getElementById('button_link') as HTMLAnchorElement
    let ptag = htmlDOM.window.document.getElementById('text_link') as HTMLParagraphElement

    atag.href = url
    ptag.textContent = url

    const options = {
        from: env.emailLogin,
        to: email,
        subject: isEmail ? "Confirm Email ✔" : "Forgot Password ❓",
        html: htmlDOM.window.document.body.innerHTML
    }

    transporter.sendMail(options)
}

export const sendEmail = async (email: string, isEmail: boolean, url: string) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.emailLogin,
            pass: env.emailPassword,
        },
    })
    let htmlDOM

    if (isEmail)
        htmlDOM = new JSDOM(await fs.promises.readFile(path.join(__dirname, '../public/confEmail.html'), 'utf8'))
    else
        htmlDOM = new JSDOM(await fs.promises.readFile(path.join(__dirname, '../public/forgotPassword.html'), 'utf8'))

    let atag = htmlDOM.window.document.getElementById('button_link') as HTMLAnchorElement
    let ptag = htmlDOM.window.document.getElementById('text_link') as HTMLParagraphElement

    atag.href = url
    ptag.textContent = url

    const options = {
        from: env.emailLogin,
        to: email,
        subject: isEmail ? "Confirm Email ✔" : "Forgot Password ❓",
        html: htmlDOM.window.document.body.innerHTML
    }

    transporter.sendMail(options, async (err) => {
        if (err) throw err
        // Loggin info
        // console.log("Message sent: %s", info.messageId)
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    })
}