const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    eventRouter = express.Router({ mergeParams: true }),
    eventController = require('../controllers/eventController');
const { FILE_PATH } = require('../config');

let storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, FILE_PATH) },
    filename: (req, file, cb) => { cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname) },
});
let upload = multer({ storage: storage });

router.use('/event', eventRouter);

eventRouter.get('/all', eventController.allEvents)
eventRouter.get('/all/:id', eventController.allEventsbyOrganizer)
eventRouter.post('/add', upload.single('image'), eventController.createEvent)
eventRouter.put('/edit/:id', eventController.editEvent)
eventRouter.put('/start/:id', eventController.startEvent)
eventRouter.put('/close/:id', eventController.closeEvent)
eventRouter.post('/upload', upload.single('image'), eventController.uploadFile)

module.exports = router;

