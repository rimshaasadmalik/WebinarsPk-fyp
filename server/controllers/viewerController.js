const ContactUs = require('../models/ContactUs');
const User = require('../models/userSchema');
const Viewer = require('../models/viewerSchema');
const Payment = require('../models/paymentSchema');
const Event = require('../models/eventSchema');
const Booking = require('../models/bookingSchema');

module.exports = {

    dashboard: async (req, res) => {
        const events = await Event.count({ })
        const bookings = await Booking.count({ userId: req.params.id })
        res.status(200).json({ success: true, message: 'Successfully get dashboard stats', payload: { events, bookings } })
        // Event.find({}, { __v: 0 })
        //     .then(result => { res.status(200).json({ success: true, message: 'Successfully get Organizers', payload: result }) })
        //     .catch(error => { res.status(400).json({ success: false, message: 'Error getting Organizers', payload: error }) })
    },

    allContactUs: async (req, res) => {
        Event.find({}, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get ContactUs requests', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting ContactUs requests', payload: error }) })
    },

    createContactUs: async (req, res) => {
        const { name, email, subject, message, city, zip } = req.body;
        if (!name, !email, !subject, !message, !city, !zip) {
            return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
        }
        try {
            const contactus = new ContactUs({ name, email, subject, message, city, zip })
            await contactus.save()
                .then(result => res.status(200).json({ success: true, message: 'Your Request sent', payload: result }))
                .catch(error => res.status(400).json({ success: false, message: 'There is some error', payload: error }))
        } catch (err) {
            console.log(err);
            res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
        }

    },

    getProfile: async (req, res) => {
        // console.log('here');
        User.findOne({ _id: req.params.id }, { email: 1, username: 1 })
            .then(result => {
                Viewer.findOne({ userId: result._id })
                    .then(org => res.status(200).json({ success: true, message: 'Successfully get Profile', payload: org }))
                    .catch(error => { res.status(400).json({ success: false, message: 'Error getting Profile', payload: error }) })
            })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Profile', payload: error }) })
    },

    uploadAvatar: async (req, res) => {
        if (!req.file) {
            console.log("No file is available!");
            return res.status(400).json({ status: false, message: "Please select avatar", payload: {} });
        }
        Viewer.findOneAndUpdate({ _id: req.body.id }, { $set: { image: req.file.filename } })
            .then(org => res.status(200).json({ success: true, message: 'Avatar successfully uploaded', payload: org }))
            .catch(error => { res.status(400).json({ success: false, message: 'Error uploading avatar', payload: error }) })

    },

    editProfile: async (req, res) => {
        const { name, email, bio, phoneno, profession, dob, bname, bcode, accountno, accounttitle } = req.body;
        console.log({ name, email, bio, phoneno, profession, dob, bname, bcode, accountno, accounttitle });
        if (!name, !email, !phoneno, !dob, !profession, !bio, !bname, !bcode, !accountno, !accounttitle)
            return res.status(400).json({ success: false, message: 'Please Fill all the fields.', payload: {} })

        Viewer.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { name: name, email: email, bio: bio, phoneno: phoneno, profession: profession, dob: dob, bname: bname, bcode: bcode, accountno: accountno, accounttitle: accounttitle } }
        )
            .then(org => res.status(200).json({ success: true, message: 'Successfully update Profile', payload: org }))
            .catch(error => { res.status(400).json({ success: false, message: 'Error updating Profile', payload: error }) })
    },

    uploadReceipt: async (req, res) => {
        const { userId, payment } = req.body;
        console.log(payment);
        if (!req.file) {
            console.log("Receipt is not available!");
            return res.status(400).json({ status: false, message: "Please select receipt", payload: {} });
        }
        try {
            Payment.findOneAndUpdate({ _id: payment }, { $set: { receipt: req.file.filename } })
                .then(result => res.status(200).json({ success: true, message: 'Receipt successfully uploaded', payload: result }))
                .catch(error => { res.status(400).json({ success: false, message: 'Error uploading Receipt', payload: error }) })
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false, message: 'Error uploading Receipt', payload: error })
        }

    },

}
