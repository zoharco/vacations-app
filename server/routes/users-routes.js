const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', usersController.getUsers);

router.post(
    '/signup', 
    [
        check('username').not().isEmpty(),
        check('email')
            .normalizeEmail() 
            .isEmail(),
        check('password').isLength({ min: 6 })
    ], 
    usersController.signup
);

router.post(
    '/login',
    [
        check('username').not().isEmpty(),
        check('password').isLength({ min: 6 })
    ], 
    usersController.login);

router.use(checkAuth);
router.get('/:uid/my-vacations', usersController.getMyVacations);
router.post('/:uid/follow', usersController.addFollower);
router.delete('/:uid/unfollow', usersController.removeFollower);

module.exports = router;
