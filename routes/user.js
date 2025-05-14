const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getUser, updateUser, followUser, unfollowUser, searchUsers, getSuggestions, getFollowing, getFollowers } = require('../controllers/user');

router.get('/:id', getUser);
router.put('/:id', auth, upload.single('profilePicture'), updateUser);
router.post('/:id/follow', auth, followUser);
router.post('/:id/unfollow', auth, unfollowUser);
router.get('/search', searchUsers);
router.get('/suggestions', auth, getSuggestions);
router.get('/:id/following', getFollowing);
router.get('/:id/followers', getFollowers);

module.exports = router;