const adminController = require('../controllers/adminController');
const streamController = require('../controllers/streamController');

const express = require('express'),
    router = express.Router(),
    streamRouter = express.Router({ mergeParams: true }),
    bookingController = require('../controllers/bookingController'),
    organizerController = require('../controllers/organizerController'),
    eventController = require('../controllers/eventController'),
    viewerController = require('../controllers/viewerController');

router.use('/stream', streamRouter);

streamRouter.post('/room', streamController.getRoomId)
streamRouter.post('/organizer/room', streamController.joinOrganizer)
// viewerRouter.post('/booking/add', bookingController.createBooking)
// // eventRouter.put('/booking/update/:id', bookingController.updateBooking)
// // eventRouter.put('/booking/cancel/:id', bookingController.cancelBooking)
// // eventRouter.put('/booking/delete/:id', bookingController.deleteBooking)

// viewerRouter.get('/organizers/all', organizerController.allOrganizers)
// viewerRouter.get('/faq/all', adminController.allFaqs)
// viewerRouter.get('/events/bycategory', eventController.allEventsbyCategory)
// viewerRouter.post('/contactus/add', viewerController.createContactUs)

module.exports = router;

