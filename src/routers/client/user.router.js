'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler.helper');
const { userController } = require('../../controllers/client/user.controller');
const { authentication } = require('../../middlewares/client/authentication.middleware');
const router = express.Router();

router.post('/login', asyncHandler( userController.login ));
router.post('/signup', asyncHandler( userController.signup ));

//---middleware authetication
router.use(authentication);

router.post('/logout', asyncHandler( userController.logout ));
router.get('/', asyncHandler( userController.getUserByUserId ));

module.exports = router;