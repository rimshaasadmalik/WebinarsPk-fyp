const ContactUs = require('../models/ContactUs'),
    Faq = require('../models/Faq'),
    User = require('../models/userSchema'),
    Event = require('../models/eventSchema'),
    Organizer = require('../models/organizerSchema'),
    Booking = require('../models/bookingSchema'),
    Viewer = require('../models/viewerSchema');

module.exports = {

    dashboard: async (req, res) => {
        const events = await Event.countDocuments({})
        const artists = await User.countDocuments({ role: 'organizer' })
        const viewers = await User.countDocuments({ role: 'viewer' })
        const requests = await ContactUs.countDocuments({})
        res.status(200).json({ success: true, message: 'Successfully get dashboard stats', payload: { events, artists, viewers, requests } })
    },

    allFaqs: async (req, res) => {
        Faq.find({}, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Faqs', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Faqs', payload: error }) })
    },

    createFaq: async (req, res) => {
        const { title, message } = req.body;
        if (!title, !message) {
            return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
        }
        try {
            const faq = new Faq({ title, message })
            await faq.save()
                .then(result => res.status(200).json({ success: true, message: 'Faq created successfully', payload: result }))
                .catch(error => res.status(400).json({ success: false, message: 'Error creating Faq', payload: error }))
        } catch (err) {
            console.log(err);
            res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
        }

    },

    editFaq: async (req, res) => {
        const { title, message } = req.body;
        if (!title, !message) return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
        try {
            Faq.findByIdAndUpdate(req.params.id, { $set: { title: title, message: message } })
                .then(result => { res.status(200).json({ success: true, message: 'Successfully updated Faq', payload: result }) })
                .catch(error => { res.status(400).json({ success: false, message: 'Error updating Faq', payload: error }) })
        } catch (error) {
            res.status(400).json({ success: false, message: 'Error updating Faq', payload: error })
        }

    },

    deleteFaq: async (req, res) => {
        Faq.findByIdAndDelete(req.params.id)
            .then(result => { res.status(200).json({ success: true, message: 'Successfully delete Faq', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error deleting Faq', payload: error }) })
    },

    allUnRespondedRequests: async (req, res) => {
        ContactUs.find({ isResponded: false }, { __v: 0 })
            .sort({ createdAt: -1 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Faqs', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Faqs', payload: error }) })
    },

    allRespondedRequests: async (req, res) => {
        ContactUs.find({ isResponded: true }, { __v: 0 })
            .sort({ updatedAt: -1 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Faqs', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Faqs', payload: error }) })
    },

    respondeRequest: async (req, res) => {
        const { response } = req.body;
        console.log(response);
        if (!response) return res.status(400).json({ status: false, message: "Please fill response message properly", payload: {} });

        try {
            const request = await ContactUs.findById(req.params.id)
            if (request) {
                const updated = await ContactUs.findByIdAndUpdate(req.params.id, { $set: { isResponded: true, response: response } })
                const data = { email: request.email, subject: request.subject, htmlData: `<div><p>${response}</p></div>` }
                require('../config/emailService').emailer(data)
                    .then((resolve) => { res.status(200).json({ success: true, message: "Response Sent", payload: {} }) })
                    .catch((reject) => { console.log(reject); res.status(400).json({ success: false, message: "Could not send response", payload: {} }) })
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
        }
    },

    deleteRequest: async (req, res) => {
        ContactUs.findByIdAndDelete(req.params.id)
            .then(result => { res.status(200).json({ success: true, message: 'Successfully delete Request', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error deleting Request', payload: error }) })
    },

    allUsers: async (req, res) => {
        User.find({}, { email: 1, role: 1 }).populate('organizers').populate('viewers')
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Users', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Users', payload: error }) })
    },

    allArtists: async (req, res) => {
        Organizer.find({ role: 'organizer' }, { name: 1, email: 1, userId: 1, profession: 1, dob: 1, isActive: 1 })//.populate('userId','email role')
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Users', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Users', payload: error }) })
    },

    deactivateArtist: async (req, res) => {
        try {
            Organizer.findOneAndUpdate({ userId: req.params.id }, { $set: { isActive: false } })
                .then(async (result) => {
                    const user = await User.findByIdAndUpdate(req.params.id, { $set: { isActive: false } })
                    res.status(200).json({ success: true, message: 'Artist Deactivated', payload: result })
                })
                .catch(error => { res.status(400).json({ success: false, message: 'Error deactivation Artist', payload: error }) })
        } catch (error) {
            res.status(400).json({ success: false, message: 'Error deactivation Artist', payload: error })
        }
    },

    activateArtist: async (req, res) => {
        try {
            Organizer.findOneAndUpdate({ userId: req.params.id }, { $set: { isActive: true } })
                .then(async (result) => {
                    const user = await User.findByIdAndUpdate(req.params.id, { $set: { isActive: true } })
                    res.status(200).json({ success: true, message: 'Artist activated', payload: result })
                })
                .catch(error => { res.status(400).json({ success: false, message: 'Error activation Artist', payload: error }) })
        } catch (error) {
            res.status(400).json({ success: false, message: 'Error activation Artist', payload: error })
        }
    },

    allViewers: async (req, res) => {
        Viewer.find({ role: 'viewer' }, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Users', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Users', payload: error }) })
    },

    deactivateViewer: async (req, res) => {
        try {
            Viewer.findOneAndUpdate({ userId: req.params.id }, { $set: { isActive: false } })
                .then(async (result) => {
                    const user = await User.findByIdAndUpdate(req.params.id, { $set: { isActive: false } })
                    res.status(200).json({ success: true, message: 'Viewer Deactivated', payload: result })
                })
                .catch(error => { res.status(400).json({ success: false, message: 'Error deactivation viewer', payload: error }) })
        } catch (error) {
            res.status(400).json({ success: false, message: 'Error deactivation viewer', payload: error })
        }
    },

    activateViewer: async (req, res) => {
        try {
            Viewer.findOneAndUpdate({ userId: req.params.id }, { $set: { isActive: true } })
                .then(async (result) => {
                    const user = await User.findByIdAndUpdate(req.params.id, { $set: { isActive: true } })
                    res.status(200).json({ success: true, message: 'Viewer activated', payload: result })
                })
                .catch(error => { res.status(400).json({ success: false, message: 'Error activation viewer', payload: error }) })
        } catch (error) {
            res.status(400).json({ success: false, message: 'Error activation viewer', payload: error })
        }
    },

    allEvents: async (req, res) => {
        Event.find({}, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Events', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Events', payload: error }) })
    },


}
