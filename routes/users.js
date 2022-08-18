const router = require('express').Router();

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserById);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
