const express = require('express');

const peopleController = require('../controllers/people');

const router = express.Router();

// GET /people/posts
router.get('/posts', peopleController.getPosts);
router.get('/posts/:socialSecurityNumber', peopleController.getPostsBySSN);

// POST /people/post
router.post('/post', peopleController.createPost);

// PUT /people/put
router.put('/put/:socialSecurityNumber', peopleController.updatePut);

// DELETE /people/delete
router.delete('/delete/:socialSecurityNumber', peopleController.deletePostsBySSN);

module.exports = router;