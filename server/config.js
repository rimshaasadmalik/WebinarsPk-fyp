const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    BCRYPT_SALT: process.env.BCRYPT_SALT,
    LOG_LEVEL: process.env.LOG_LEVEL,
    MORGAN_FORMAT: process.env.MORGAN_FORMAT,
    MONGOURI: process.env.MONGOURI,
    MAILER_USER: process.env.MAILER_USER,
    MAILER_PWD: process.env.MAILER_PWD,
    SMTP_PORT: process.env.SMTP_PORT,
    FILE_PATH: process.env.FILE_PATH,
    AVATAR_PATH: process.env.AVATAR_PATH,
    RECEIPT_PATH: process.env.RECEIPT_PATH
};
