const nodemailer = require('nodemailer')
const config = require('../config')

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: { user: config.email.user, pass: config.email.pass }
})

async function sendOrderConfirmation(to, subject, html) {
  return transporter.sendMail({ from: config.email.user, to, subject, html })
}

module.exports = { sendOrderConfirmation }
