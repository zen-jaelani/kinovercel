const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require("fs");
const mustache = require("mustache");

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.jp",
        secure: true,
        port: 465,
        auth: {
          user: process.env.AUTHMAIL,
          pass: process.env.AUTHPASS,
        },
      });

      const fileTemplate = fs.readFileSync(
        `src/templates/email/${data.template}`,
        "utf8"
      );
      console.log(data);

      const mailOption = {
        from: process.env.AUTHMAIL,
        to: data.to,
        subject: data.subject,
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};
