const bookingController = require('../controllers/bookingController');

const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    organizerRouter = express.Router({ mergeParams: true }),
    organizerController = require('../controllers/organizerController');
const { AVATAR_PATH } = require('../config');
let storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, AVATAR_PATH) },
    filename: (req, file, cb) => { cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname) },
});
let upload = multer({ storage: storage });

router.use('/organizer', organizerRouter);

organizerRouter.get('/dashboard/:id', organizerController.dashboard);
organizerRouter.post('/all', organizerController.allOrganizers);
organizerRouter.post('/upload-avatar', upload.single('image'), organizerController.uploadAvatar);
organizerRouter.get('/profile/:id', organizerController.getProfile);
organizerRouter.get('/account/:id', organizerController.getAccount);
organizerRouter.put('/profile/edit/:id', organizerController.editProfile);
organizerRouter.get('/profile/complete/:id', organizerController.profileComplete);
organizerRouter.get('/bookings/all/:id', bookingController.allBookingsbyOrganizer)
organizerRouter.put('/bookings/payment/:id', bookingController.paymentSettlement)
// organizerRouter.post('/add', organizerController.createOrganizer);

module.exports = router;
