const express = require('express'),
  router = express.Router(),
  authRouter = express.Router({ mergeParams: true }),
  authController = require('../controllers/authController')

router.use('/auth', authRouter);

authRouter.post('/register', authController.register);
authRouter.post('/register/verify', authController.verifyRegistration);
authRouter.post('/login', authController.login);
authRouter.post('/forget-password', authController.forgetPassword);
authRouter.post('/reset-password', authController.resetPassword);

module.exports = router;


// const express = require('express'),
//   router = express.Router(),
//   organizerRouter = express.Router({ mergeParams: true }),
//   organizerController = require('../controllers/organzierController')

// router.use('/organizer', organizerRouter);

// organizerRouter.post('/add', organizerController.createOrganizer);

// module.exports = router;
