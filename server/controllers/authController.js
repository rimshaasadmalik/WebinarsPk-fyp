const { check } = require('express-validator');
const Organizer = require('../models/organizerSchema');
const User = require('../models/userSchema');
const Viewer = require('../models/viewerSchema');
// const Organizer = require('../models/viewerSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BCRYPT_SALT, JWT_SECRET } = require('../config')


module.exports = {
    //Registration of User
    register: async (req, res) => {
        const { flag, name, email, password, dob, profession, interests } = req.body;
        if (!flag, !name, !email, !password, !profession) return res.status(400).json({ success: false, message: 'Please fill all the fields properly', payload: {} })
        // console.log({ flag, name, email, password })
        let otp = createOTP()
        if (flag === "isViewer") {
            console.log("isViewer");
            const userExists = await User.findOne({ email: email })
            if (userExists) return res.status(400).json({ status: false, message: "User Already Exist", payload: {} });
            else {
                bcrypt.hash(password, parseInt(BCRYPT_SALT))
                    .then((hashedpwd) => {
                        const user = new User({ username: email.split("@")[0], email: email, password: hashedpwd, role: 'viewer', otp: otp })
                        user.save()
                            .then(async (result) => {
                                const viewer = new Viewer({ userId: result._id, name, email, dob, interests, profession: profession })
                                await viewer.save()
                                const data = { email: email, subject: "Registration Code", htmlData: `<div><h2>Registration Code</h2><p><b>Your Code: </b>${otp} <small><i>please use this Code to complete your registration.</i></small></p></div>` }
                                // console.log(data);
                                require('../config/emailService').emailer(data)
                                    .then((resolve) => { res.status(200).json({ success: true, message: "Please check your email for registration code", payload: user }) })
                                    .catch((reject) => { console.log(reject); res.status(400).json({ success: false, message: "Could not send email", payload: {} }) })
                                // res.status(200).json({ success: true, message: 'User created successfully', payload: result })
                            })
                            .catch(error => { res.status(400).json({ success: false, message: 'Error creating user', payload: error }) })
                    })
                    .catch((err) => {
                        res.json({ status: false, message: 'Error encrypting password', payload: err });
                        console.log('Error encrypting password')
                    })
            }
        }
        else if (flag === "isOrganizer") {
            console.log('isOrganizer');
            const userExists = await User.findOne({ email: email })
            if (userExists) return res.status(400).json({ status: false, message: "User Already Exist", payload: {} });
            else {
                try {
                    bcrypt.hash(password, parseInt(BCRYPT_SALT))
                        .then((hashedpwd) => {
                            const user = new User({ username: email.split("@")[0], email: email, password: hashedpwd, role: 'organizer', otp: otp })
                            user.save()
                                .then(async (result) => {
                                    const organizer = new Organizer({ userId: result._id, name, email, dob, profession: profession })
                                    await organizer.save() //.then(resl => console.log(resl)).cathc(err => { console.log(err) })
                                    const data = { email: email, subject: "Registration Code", htmlData: `<div><h2>Registration Code</h2><p><b>Your Code: </b>${otp} <small><i>please use this Code to complete your registration.</i></small></p></div>` }
                                    // console.log(data);
                                    require('../config/emailService').emailer(data)
                                        .then((resolve) => { res.status(200).json({ success: true, message: "Please check your email for registration code", payload: user }) })
                                        .catch((reject) => { console.log(reject); res.status(400).json({ success: false, message: "Could not send email", payload: {} }) })
                                    // res.status(200).json({ success: true, message: 'User created successfully', payload: result })
                                })
                                .catch(error => { res.status(400).json({ success: false, message: 'Error creating user', payload: error }) })
                        })
                        .catch((err) => {
                            res.json({ status: false, message: 'Error encrypting password', payload: err });
                            console.log('Error encrypting password')
                        })
                } catch (error) {
                    res.json({ status: false, message: 'Error encrypting password', payload: error });
                }

            }
        }
        else return res.json({ status: false, message: 'Please select Organizer or Viewer first', payload: {} });
    },

    verifyRegistration: async (req, res) => {
        const { userId, otp } = req.body
        if (!userId) return res.json({ success: false, message: 'User Id not provided' })
        if (!otp) return res.json({ success: false, message: 'OTP not provided' })

        const user = await User.findById(userId, { otp })
        console.log(user.otp, otp)

        if (user.otp == null) return res.json({ success: false, message: 'OTP expired' })
        else if (user.otp != otp) return res.json({ success: false, message: 'OTP not matched' })
        else if (user.otp == otp) {
            console.log('OTP matched')
            User.updateOne({ _id: userId }, { $set: { isActive: true, otp: null } })
                .then(result => res.json({ success: true, message: 'Registration verification complete', payload: result }))
                .catch(error => res.json({ success: false, message: 'Error registration verification', payload: error }))
        }
    },

    login: async (req, res) => {
        var { email, password } = req.body;
        if (!check(password).isEmpty() && !check(email).isEmpty() || !check(password).isEmpty()) return res.status(400).json({ success: false, message: 'email or password is missing' })
        if (check(email).isEmail()) email = email.toLowerCase()
        console.log('\n', { email, password });

        await User.findOne({ email: email })
            .then(async (user) => {
                if (user == null) return res.status(404).json({ success: false, message: 'user does not exist', payload: {} })
                if (user.isActive == false) return res.status(404).json({ success: false, message: 'User Status DeActive', payload: {} })
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result == false) return res.json({ success: false, message: 'authentication failed, Password mismatched', payload: {} })
                        else {
                            console.log(`'${user.email}' login successfully.`);
                            const access_token = jwt.sign({ id: user._id, expiresIn: '1h' }, process.env.JWT_SECRET)
                            User.updateOne({ _id: user._id }, { $set: { token: access_token } }).then(result => console.log('user login updated', result)).catch(error => console.log('error while updating user', error))

                            res.status(200).json({
                                success: true,
                                message: 'User login successfull',
                                payload: { _id: user._id, username: user.username, email: user.email, role: user.role },
                                token: access_token
                            })
                        }
                    })
                    .catch(error => { res.status(400).json({ success: false, message: 'Some Error', payload: error }) })
            })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting User', payload: error }) })

    },

    forgetPassword: async (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email not provided', payload: {} })
        if (!check('email').isEmail) return res.status(400).json({ success: false, message: 'Email is not in proper format', payload: {} })

        const user = await User.findOne({ email: email }, { email: 1, otp: 1 })
        console.log(user);
        if (user.otp != null) return res.status(200).json({ success: false, message: 'You already have OTP. Please check your email', payload: {} })
        if (user) {
            const otp = createOTP()
            await User.updateOne({ _id: user._id }, { $set: { otp: otp } })
                .then(result => {
                    if (result.nModified == 1) {
                        // const data = { otp: otp, email: user.email, message:`` }
                        const data = { email: user.email, subject: "Reset Your Password", htmlData: `<div><h2>OTP created against your password resetting request</h2><p><b>Your OTP: </b>${otp} <small><i>use to reset password</i></small></p></div>` }
                        // console.log(data);
                        require('../config/emailService').emailer(data)
                            .then((resolve) => { res.status(200).json({ success: true, message: "Please check your email", payload: {} }) })
                            .catch((reject) => { console.log(reject); res.status(400).json({ success: false, message: "Could not send email", payload: {} }) })
                    }
                    else { res.status(400).json({ success: false, message: "could create OTP.", payload: {} }) }
                })
                .catch(error => { res.status(400).json({ success: false, message: "could not update OTP", payload: error }) })
        }
        else { res.status(400).json({ success: false, message: "User not found for this email", payload: {} }) }
    },

    resetPassword: async (req, res) => {
        const { email, password, otp } = req.body
        if (!email) return res.json({ success: false, message: 'Email not provided' })
        if (!password) return res.json({ success: false, message: 'Password not provided' })
        if (!otp) return res.json({ success: false, message: 'OTP not provided' })

        const user = await User.findOne({ email: email }, { otp })
        console.log(user.otp, otp)

        if (user.otp == null) return res.json({ success: false, message: 'OTP expired' })
        else if (user.otp != otp) return res.json({ success: false, message: 'OTP not matched' })
        else if (user.otp == otp) {
            console.log('OTP matched')
            // const salt = bcrypt.genSaltSync(10)
            bcrypt.hash(password, parseInt(BCRYPT_SALT)).then(async (hashedpwd) => {
                const user = await User.updateOne({ email: email }, { $set: { password: hashedpwd } })
                if (user) {
                    User.updateOne({ email: email }, { $set: { otp: null } }).then(result => console.log('OTP set null'))
                    return res.status(200).json({ success: true, message: 'Password recovered successfully' })
                }
                else return res.json({ success: false, message: 'Password recovery error' })
            }).catch((err) => res.json({ success: false, message: 'Error', payload: err }))
        }
    },

}


createOTP = () => {
    // const otp = Math.floor((Math.random() * 10000) + 1);
    const otp = Math.floor(1000 + Math.random() * 9000)
    return otp
}



    // // console.log({ name, username, email, password, confirmpassword, phoneno, profession, dob, interest });
    // const organizerExist = await Organizer.findOne({ email: email });
    // // console.log('organizerExist: ', organizerExist);
    // if (organizerExist) return res.status(400).json({ status: false, message: "Organizer Already Exist", payload: {} });
    // if (password != confirmpassword) return res.status(400).json({ status: false, message: "Password mismatched", payload: {} })
    // if (!name || !username || !email || !password || !confirmpassword || !phoneno || !profession || !dob || !interest) {
    //   return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
    // }
    // try {
    //   const organizer = new Organizer({ name, username, email, password, confirmpassword, phoneno, profession, dob, interest })
    //   await organizer.save()
    //     .then(result => res.status(200).json({ success: true, message: 'organizer created successfully', payload: result }))
    //     .catch(error => res.status(400).json({ success: false, message: 'Error creating Organizer', payload: error }))
    //   // res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
    // } catch (err) {
    //   console.log(err)
    //   res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
    // }
