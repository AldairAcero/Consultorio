/*const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'postmaster@sandboxaf6df539ee1a4e4680e1329e9e3695c6.mailgun.org',
        pass: 'f1cf5e3cf20ccd1dc2ede755922a47f0-87cdd773-9a2357c2'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({ from, subject, to, html }, (err, info) => {
                if (err) reject(err);

                resolve(info);
            });
        });
    }
};*/

const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jrobertodelac@gmail.com',
        pass: 'Roberto18035'
    }
});

module.exports = {
    sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({ from, subject, to, html }, (err, info) => {
                if (err) reject(err);

                resolve(info);
            });
        });
    }
};