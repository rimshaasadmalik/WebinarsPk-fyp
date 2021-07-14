const express = require('express'),
    router = express.Router(),
    adminRouter = express.Router({ mergeParams: true }),
    adminController = require('../controllers/adminController');

router.use('/admin', adminRouter);

adminRouter.get('/dashboard/:id', adminController.dashboard);
adminRouter.post('/faq/add', adminController.createFaq);
adminRouter.get('/faq/all', adminController.allFaqs);
adminRouter.put('/faq/edit/:id', adminController.editFaq);
adminRouter.delete('/faq/delete/:id', adminController.deleteFaq);
adminRouter.get('/contactus/all', adminController.allUnRespondedRequests);
adminRouter.get('/contactus/responded/all', adminController.allRespondedRequests);
adminRouter.put('/contactus/responde/:id', adminController.respondeRequest);
adminRouter.delete('/contactus/delete/:id', adminController.deleteRequest);
adminRouter.get('/users/all', adminController.allUsers);
adminRouter.get('/artists/all', adminController.allArtists);
adminRouter.put('/artist/deactivate/:id', adminController.deactivateArtist);
adminRouter.put('/artist/activate/:id', adminController.activateArtist);
adminRouter.get('/viewers/all', adminController.allViewers);
adminRouter.put('/viewer/deactivate/:id', adminController.deactivateViewer);
adminRouter.put('/viewer/activate/:id', adminController.activateViewer);
adminRouter.get('/events/all', adminController.allEvents);

module.exports = router;
