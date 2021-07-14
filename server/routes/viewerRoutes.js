const adminController = require('../controllers/adminController');

const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    viewerRouter = express.Router({ mergeParams: true }),
    bookingController = require('../controllers/bookingController'),
    organizerController = require('../controllers/organizerController'),
    notificationController = require('../controllers/notificationController'),
    eventController = require('../controllers/eventController'),
    viewerController = require('../controllers/viewerController');

const { AVATAR_PATH, RECEIPT_PATH } = require('../config');
let storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, AVATAR_PATH) },
    filename: (req, file, cb) => { cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname) },
});
let upload = multer({ storage: storage });

let receiptStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, RECEIPT_PATH) },
    filename: (req, file, cb) => { cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname) },
});
let uploadReceipt = multer({ storage: receiptStorage });

router.use('/viewer', viewerRouter);

viewerRouter.get('/dashboard/:id', viewerController.dashboard);
viewerRouter.get('/profile/:id', viewerController.getProfile);
viewerRouter.post('/upload-avatar', upload.single('image'), viewerController.uploadAvatar);
viewerRouter.put('/profile/edit/:id', viewerController.editProfile);

viewerRouter.get('/bookings/all/:id', bookingController.allBookingsbyViewer)
viewerRouter.post('/booking/add', bookingController.createBooking)
viewerRouter.post('/upload/receipt', uploadReceipt.single('image'), viewerController.uploadReceipt);
// eventRouter.put('/booking/update/:id', bookingController.updateBooking)
// eventRouter.put('/booking/cancel/:id', bookingController.cancelBooking)
// eventRouter.put('/booking/delete/:id', bookingController.deleteBooking)

viewerRouter.get('/organizers/all', organizerController.allOrganizers)
viewerRouter.get('/faq/all', adminController.allFaqs)
viewerRouter.get('/events/bycategory', eventController.allEventsbyCategory)
viewerRouter.post('/contactus/add', viewerController.createContactUs)

viewerRouter.get('/notifications/all/:id', notificationController.allNotifications)

module.exports = router;

