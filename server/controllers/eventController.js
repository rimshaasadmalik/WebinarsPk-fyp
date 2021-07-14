const Booking = require('../models/bookingSchema')
const Event = require('../models/eventSchema')
const Room = require('../models/Room')
const Organizer = require('../models/organizerSchema')


module.exports = {

    allEvents: async (req, res) => {
        Event.find({ isClosed: false }, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Events', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Events', payload: error }) })
    },

    allEventsbyOrganizer: async (req, res) => {
        Event.find({ userId: req.params.id, isClosed: false }, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Events', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Events', payload: error }) })
    },

    allEventsbyCategory: async (req, res) => {
        console.log('Event Condition: ', req.query.type);
        Event.find({ category: req.query.type, isClosed: false }, { __v: 0 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Events', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Events', payload: error }) })
    },

    createEvent: async (req, res) => {
        const { eventImage, userId, hostName, name, description, category, eventDate, eventTime, duration, amount } = req.body;
        if (!userId, !name, !description, !category, !eventDate, !eventTime, !duration) {
            return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
        }
        let _duration = parseInt(duration)
        console.log(req.body);
        if (!req.file) {
            console.log("No file is available!");
            return res.status(400).json({ status: false, message: "Please attach Event Image", payload: {} });
        }
        try {

            const event = new Event({ eventImage: req.file.filename, userId, hostName, name, description, category, eventDate, eventTime, duration: _duration, amount })
            await event.save()
                .then(async (result) => {
                    const room = new Room({ roomId: createRoomId(), event: result._id })
                    await room.save()
                    res.status(200).json({ success: true, message: 'Event created successfully', payload: result })
                })
                .catch(error => { console.log(error); res.status(400).json({ success: false, message: 'Error creating Event', payload: error }) })
        } catch (err) {
            console.log(err);
            res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
        }

    },

    editEvent: async (req, res) => {
        const { hostName, name, description, eventDate, eventTime, duration, amount } = req.body;
        if (!name, !description, !eventDate, !eventTime, !duration) {
            return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
        }

        Event.findByIdAndUpdate({ _id: req.params.id }, { $set: { hostName, name, description, eventDate, eventTime, duration, amount } })
            .then(async (result) => {
                // console.log(result);
                const bookings = await Booking.find({ event: req.params.id }, { userId: 1, organizer: 1 })
                // console.log(bookings);
                for (let i = 0; i < bookings.length; i++) {
                    const e = bookings[i];
                    const obj = { title: "Event Update", message: `Event '${result.name}' Has been Updated.`, user: e.userId, createdBy: e.organizer }
                    require('../config/notificationService').sendNotification(obj).then(resolve => console.log(resolve)).catch(reject => console.log(reject))
                }
                res.status(200).json({ success: true, message: 'Event created successfully', payload: result })
            })
            .catch(error => res.status(400).json({ success: false, message: 'Error creating Event', payload: error }))
    },

    startEvent: async (req, res) => {
        const booking = await Booking.findOne({ event: req.params.id })
        // if (booking == null) return res.status(200).json({ success: false, message: 'Event could not start before any booking', payload: {} });
        Event.findByIdAndUpdate({ _id: req.params.id }, { $set: { isStarted: true } })
            .then(async (result) => {
                const bookings = await Booking.find({ event: req.params.id }, { userId: 1, organizer: 1 })
                // console.log(bookings);
                for (let i = 0; i < bookings.length; i++) {
                    const e = bookings[i];
                    const obj = { title: "Event Start", message: `Event '${result.name}' Has been Started. You can join now.`, user: e.userId, createdBy: e.organizer }
                    require('../config/notificationService').sendNotification(obj).then(resolve => console.log(resolve)).catch(reject => console.log(reject))
                }
                res.status(200).json({ success: true, message: 'Event Started, You can join now.', payload: result })
            })
            .catch(error => res.status(400).json({ success: false, message: 'Error starting Event', payload: error }))
    },

    closeEvent: async (req, res) => {
        // const evnet = await Evnet.findByIdAndUpdate({ _id: req.params.id }, { $set: { isClosed: true } })
        // const booking = await Booking.findOneAndUpdate({ event: req.params.id }, { $set: { isClosed: true } })
        Event.findByIdAndUpdate({ _id: req.params.id }, { $set: { isClosed: true } })
            .then((result) => {
                Booking.updateMany({ event: req.params.id }, { $set: { isClosed: true } })
                    .then(result => { res.status(200).json({ success: true, message: 'Event closed successfully', payload: result }) })
                    .catch(error => { res.status(400).json({ success: false, message: 'Error closing booking Events', payload: error }) })
            })
            .catch(error => res.status(400).json({ success: false, message: 'Error closing Event', payload: error }))
    },

    uploadFile: async (req, res) => {
        console.log(req.file);
        if (!req.file) {
            console.log("No file is available!");
            return res.status(400).json({ status: false, message: "Please attach Event Image", payload: {} });
        }
        try {
            const event = new Event({ eventImage: req.file.filename })
            await event.save()
                .then(async (result) => {
                    const room = new Room({ roomId: createRoomId(), event: result._id })
                    await room.save()
                    res.status(200).json({ success: true, message: 'Event created successfully', payload: result })
                })
                .catch(error => res.status(400).json({ success: false, message: 'Error creating Event', payload: error }))
        } catch (err) {
            console.log(err);
            res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
        }

    },

}


createRoomId = () => {
    // const otp = Math.floor((Math.random() * 10000) + 1);
    const rId = Math.floor(100000000 + Math.random() * 900000000)
    return rId
}
