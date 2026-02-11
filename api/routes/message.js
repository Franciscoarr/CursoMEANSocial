'use strict'

var express = require('express');
var MessageController = require('../controllers/message');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:pages', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:pages', md_auth.ensureAuth, MessageController.getAnyMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);


module.exports = api;