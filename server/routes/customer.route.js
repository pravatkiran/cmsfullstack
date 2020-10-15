const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const Customer = require('../models/customer.model');
const { check } = require('express-validator');

router.post('/createCustomer', customerController.create);
router.get('/getAll', customerController.getAll);
router.get('/getById/:id', customerController.getById);
router.put('/update/:id', check().custom((value, { req }) => {
    return Customer.findByPk(req.params.id).then(customer => {
        if (!customer) {
            return Promise.reject('Customer not found')
        }
    })
}), customerController.update);

router.delete('/delete/:id', check().custom((value, { req }) => {
    return Customer.findByPk(req.params.id).then(customer => {
        if (!customer) {
            return Promise.reject('Customer not found');
        }
    })
}), customerController.delete);

router.get('/getByAge', customerController.getByAge);
module.exports = router;