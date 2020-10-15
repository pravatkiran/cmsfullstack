const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { check } = require('express-validator')
const User = require('../models/user.model');
const passport = require('passport');

router.post('/signup', check('email').isEmail().withMessage('Please enter valid Email')
    .custom((value, { req }) => {
        return User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) {
                return Promise.reject('Email already exists.')
            }
        })
    }), userController.postUser);

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure'}), userController.login);
router.get('/login-failure', (req, res) => {
    res.status(422).json({ status: 'fail', message: 'Invalid Email or Password' });
})
router.get('/logout', userController.logout);

module.exports = router;
