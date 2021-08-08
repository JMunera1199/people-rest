const express = require('express');

const peopleController = require('../controllers/people');

const router = express.Router();

// GET /people/posts
router.get('/person', peopleController.getPosts);
router.get('/person/:socialSecurityNumber', peopleController.getPostsBySSN);

// POST /people/post
router.post('/person', peopleController.createPost);

// PUT /people/put
router.put('/person/:socialSecurityNumber', peopleController.updatePut);

// DELETE /people/delete
router.delete('/person/:socialSecurityNumber', peopleController.deletePostsBySSN);

module.exports = router;