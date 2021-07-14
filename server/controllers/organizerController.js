const { isValidObjectId } = require('mongoose');
const { db } = require('../models/organizerSchema');
const Organizer = require('../models/organizerSchema');
const User = require('../models/userSchema');
const Event = require('../models/eventSchema');
const Booking = require('../models/bookingSchema');
//var MongoClient = require('mongodb').MongoClient;


module.exports = {

    dashboard: async (req, res) => {
        const events = await Event.count({ userId: req.params.id })
        const payments = await Booking.find({ organizer: req.params.id }, { payment: 1 }).populate('payment', 'amount')
        res.status(200).json({ success: true, message: 'Successfully get dashboard stats', payload: { events, payments } })
        // Event.find({}, { __v: 0 })
        //     .then(result => { res.status(200).json({ success: true, message: 'Successfully get Organizers', payload: result }) })
        //     .catch(error => { res.status(400).json({ success: false, message: 'Error getting Organizers', payload: error }) })
    },

    allOrganizers: async (req, res) => {
        Organizer.find({}, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Organizers', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Organizers', payload: error }) })
    },

    getProfile: async (req, res) => {
        // console.log('here');
        User.findOne({ _id: req.params.id }, { email: 1, username: 1 })
            .then(result => {
                Organizer.findOne({ userId: result._id })
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
        Organizer.findOneAndUpdate({ _id: req.body.id }, { $set: { image: req.file.filename } })
            .then(org => res.status(200).json({ success: true, message: 'Avatar successfully uploaded', payload: org }))
            .catch(error => { res.status(400).json({ success: false, message: 'Error uploading avatar', payload: error }) })

    },

    editProfile: async (req, res) => {
        const { name, email, bio, phoneno, profession, dob, bname, bcode, accountno, accounttitle } = req.body;
        console.log({ name, email, bio, phoneno, profession, dob, bname, bcode, accountno, accounttitle });
        if (!name, !email, !phoneno, !dob, !profession, !bio, !bname, !bcode, !accountno, !accounttitle)
            return res.status(400).json({ success: false, message: 'Please Fill all the fields.', payload: {} })

        Organizer.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { name: name, email: email, bio: bio, phoneno: phoneno, profession: profession, dob: dob, bname: bname, bcode: bcode, accountno: accountno, accounttitle: accounttitle } }
        )
            .then(org => res.status(200).json({ success: true, message: 'Successfully update Profile', payload: org }))
            .catch(error => { res.status(400).json({ success: false, message: 'Error updating Profile', payload: error }) })
    },

    profileComplete: async (req, res) => {
        const organizer = await Organizer.findOne({ userId: req.params.id }, { accountno: 1, accounttitle: 1, bname: 1, bcode: 1 })
        console.log('Organizer', organizer);
        if (organizer == null) return res.status(400).json({ status: false, message: "Organizer not exists", payload: {} });
        if (!organizer.accountno || organizer.accountno == '' || organizer.accountno == null || organizer.accountno == undefined)
            return res.status(400).json({ status: false, message: "Please Complete your profile first", payload: {} });
        else res.status(200).json({ success: true, message: 'Profile is complete', payload: {} })
    },



    getAccount: async (req, res) => {
        Organizer.findOne({ userId: req.params.id }, { bname: 1, bcode: 1, accountno: 1, accounttitle: 1 })
            .then(org => res.status(200).json({ success: true, message: 'Successfully get Profile', payload: org }))
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Profile', payload: error }) })

    },

}

