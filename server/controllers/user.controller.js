const User = require('../models/user.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//create user 
exports.postUser = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({ status: 'fail', msg: error.array() });
        }

        await bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;

            // hash password
            bcrypt.hash(req.body.password, salt, async (err, result) => {
                if (err) throw err;
                let newUser = await User.create({
                    email: req.body.email,
                    password: result,
                    admin: req.body.admin
                });
                if (!newUser)
                    return res.status(422).json({ status: 'fail', message: 'Error while creating user.' });
                return res.status(200).json({ status: 'ok', user: newUser });
            })
        })
    } catch (err) {
        console.log('error', err);
    }
}

// login user
exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ where: { email: req.body.email } });
        await bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) throw err;
            if (result == true) {
                let token = jwt.sign({
                    email: user.email,
                    userid: user.userid
                }, 'supersecretkey', { algorithm: 'HS256' }, { expiresIn: '1hr' });
                console.log('token', token);
                return res.status(200).json({ status: 'ok', token, message: 'Logged in successfully.', session: req.session });
            }
            return res.status(422).json({ status: 'fail', message: 'Invalid email or password.' });
        })
    } catch (err) {
        console.log('error', err);
    }
}

// logout 
exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        console.log('Error ', err);
        res.send({ message: 'Logged out successfully.' })
    })
}