const Booking = require('../models/bookingSchema');
const Event = require('../models/eventSchema');
const Payment = require('../models/paymentSchema');
const Viewer = require('../models/viewerSchema');


module.exports = {

    allBookingsbyViewer: async (req, res) => {
        Booking.find({ userId: req.params.id, isClosed: false }, { __v: 0 })
            .populate('event').populate('payment')
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Bookings', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Bookings', payload: error }) })
    },

    allBookingsbyOrganizer: async (req, res) => {
        Booking.find({ event: req.params.id }, { __v: 0 })
            .populate([{ path: 'event', select: ['amount', 'paidAmount'] }, { path: 'payment', select: [] }, { path: 'userId', select: ['username', 'email'] }])
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Bookings', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Bookings', payload: error }) })
    },

    createBooking: async (req, res) => {
        const { userId, eventId, organizer } = req.body;
        console.log({ userId, eventId, organizer });
        if (!userId, !eventId, !organizer) return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
        const viewer = await Viewer.findOne({ userId: userId }, { accountno: 1, accounttitle: 1, bname: 1, bcode: 1 })
        console.log('viewer', viewer);
        if (!viewer.accountno || viewer.accountno == '' || viewer.accountno == null || viewer.accountno == undefined) return res.status(400).json({ status: false, message: "Please Complete your profile first.", payload: {} });
        try {
            const eventDetail = await Event.findById({ _id: eventId }, { amount: 1, seats: 1 })
            // console.log(eventDetail);
            if (eventDetail.seats === 0) return res.status(400).json({ status: false, message: "No Seats available", payload: {} });
            if (!eventDetail) return res.status(400).json({ status: false, message: "Event Not found", payload: {} });
            const alreadyBooking = await Booking.findOne({ userId: userId, event: eventId })
            if (alreadyBooking) return res.status(400).json({ status: false, message: "You already booked this Event.", payload: {} });
            // console.log(event.amount);
            const payment = new Payment({ status: "Pending", amount: eventDetail.amount, bname: viewer.bname, bcode: viewer.bcode, accountno: viewer.accountno, accounttitle: viewer.accounttitle })
            await payment.save()
                .then(async (result) => {
                    const booking = new Booking({ userId: userId, event: eventId, organizer: organizer, payment: result._id })
                    // const event = await Event.findByIdAndUpdate({ _id: eventId }, { $inc: { seats: -1 } })
                    await booking.save()
                        .then(book => { res.status(200).json({ success: true, message: 'Event booked successfully', payload: book }) })
                        .catch(error => res.status(400).json({ status: false, message: 'Encountered some error', payload: error }))
                })
                .catch(error => res.status(400).json({ success: false, message: 'Error booking event', payload: error }))
        } catch (err) {
            console.log(err);
            res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
        }

    },

    paymentSettlement: async (req, res) => {
        const { amount, isApproved, status, eventId } = req.body;
        // console.log({ amount }, req.params.id);

        Payment.updateOne({ _id: req.params.id }, { $inc: { paidAmount: amount }, $set: { status: status, paidAt: Date.now(), isApproved: isApproved } })
            // .populate([{ path: 'event', select: [] }, { path: 'payment', select: [] }, { path: 'userId', select: ['username', 'email'] }])
            .then(async (result) => {
                if (isApproved == true) await Event.findByIdAndUpdate({ _id: eventId }, { $inc: { seats: -1 } })
                res.status(200).json({ success: true, message: 'Successfully settled payment', payload: result })
            })
            .catch(error => { res.status(400).json({ success: false, message: 'Error updating payment', payload: error }) })
    },
}
