const Booking = require('../models/bookingSchema')
const ContactUs = require('../models/ContactUs')
const Organizer = require('../models/organizerSchema')
const Payment = require('../models/paymentSchema')
const Room = require('../models/Room')
const Viewer = require('../models/viewerSchema')


module.exports = {

    getRoomId: async (req, res) => {
        const { event, user } = req.body;
        const booking = await Booking.findOne({ event: event }).populate('payment')
        // console.log(booking);
        if (parseInt(booking.payment.amount) - parseInt(booking.payment.paidAmount) == 0) {
            const viewer = await Viewer.findOne({ userId: user }, { name: 1 })
            const organizer = await Organizer.findOne({ userId: booking.organizer }, { name: 1 })
            Room.findOne({ event: event }, { __v: 0 })
                .then(result => { res.status(200).json({ success: true, message: 'Successfully get room Id', payload: { result, viewer, organizer } }) })
                .catch(error => { res.status(400).json({ success: false, message: 'Error getting room Id', payload: error }) })
        }
        // Booking.findOne({}, { __v: 0 })
        //   .then(result => { res.status(200).json({ success: true, message: 'Successfully get room Id', payload: result }) })
        //   .catch(error => { res.status(400).json({ success: false, message: 'Error getting room Id', payload: error }) })
    },

    joinOrganizer: async (req, res) => {
        const { eventId, userId } = req.body;
        // const booking = await Booking.findOne({ event: req.params.id }).populate('payment')
        // if (booking == null) return res.status(200).json({ success: false, message: 'Event has no booking yet', payload: {} });
        // const viewer = await Viewer.findOne({ userId: booking.userId }, { name: 1 })
        const organizer = await Organizer.findOne({ userId: userId }, { name: 1 })
        Room.findOne({ event: eventId }, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get room Id', payload: { result, organizer } }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting room Id', payload: error }) })

        // Booking.findOne({}, { __v: 0 })
        //   .then(result => { res.status(200).json({ success: true, message: 'Successfully get room Id', payload: result }) })
        //   .catch(error => { res.status(400).json({ success: false, message: 'Error getting room Id', payload: error }) })
    },

    //   createContactUs: async (req, res) => {
    //     const { name, email, subject, message, city, zip } = req.body;
    //     if (!name, !email, !subject, !message, !city, !zip) {
    //       return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
    //     }
    //     try {
    //       const contactus = new ContactUs({ name, email, subject, message, city, zip })
    //       await contactus.save()
    //         .then(result => res.status(200).json({ success: true, message: 'Your Request sent', payload: result }))
    //         .catch(error => res.status(400).json({ success: false, message: 'There is some error', payload: error }))
    //     } catch (err) {
    //       console.log(err);
    //       res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
    //     }

    //   },

}
