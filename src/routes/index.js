const express = require('express');
const router = express.Router();
const get = require('../handlers/get')
const post = require('../handlers/post')

// GET CONTENT WITH LAYOUT
router.get('/', get.index);
// GET CONTENT WITHOUT LAYOUT
router.get('/content_index', get.content_index);