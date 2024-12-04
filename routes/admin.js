const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');
const { route } = require('./applications');


route.get('/', authenticateToken, isAdmin, get)