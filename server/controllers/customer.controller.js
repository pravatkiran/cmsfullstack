const Customer = require('../models/customer.model');
const { validationResult } = require('express-validator');
const sequelize = require('../config/connection');

// create customer
exports.create = async (req, res) => {
    try {
        let customer = await Customer.create({
            name: req.body.name,
            address: req.body.address,
            phone_number: req.body.phone_number,
            dob: req.body.dob
        });
        if (!customer)
            return res.status(422).json({ status: 'fail', message: 'Error occurred while creating customer' });
        return res.status(200).json({ status: 'ok', customer: customer });
    } catch (err) {
        console.log('error', err);
    }
}

// get customer list
exports.getAll = async (req, res) => {
    try {
        let customers = await Customer.findAll();

        if (!customers)
            return res.status(422).json({ status: 'fail', message: 'unable to fetch customers.' });
        return res.status(200).json({ status: 'ok', customer: customers });
    } catch (err) {
        console.log('error', err);
    }
}

// get customer by id
exports.getById = async (req, res) => {
    try {
        let customer = await Customer.findByPk(req.params.id);
        if (!customer)
            return res.status(422).json({ status: 'fail', message: 'unable to fetch customer.' });
        return res.status(200).json({ status: 'ok', customer: customer });
    } catch (err) {
        console.log('error', err);
    }
}

// update customer
exports.update = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty())
            return res.status(422).json({ status: 'fail', msg: error.array()[0].msg });

        let customer = await Customer.update({
            name: req.body.name,
            address: req.body.address,
            phone_number: req.body.phone_number,
            dob: req.body.dob
        }, {
            where: { customerid: req.params.id }
        });

        if (!customer)
            return res.status(422).json({ status: 'fail', msg: 'error while updating customer.' });
        return res.status(200).json({ status: 'ok', msg: 'updated successfully.' });
    } catch (err) {
        console.log('error', err);
    }
}

// delete customer
exports.delete = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty())
            return res.status(422).json({ status: 'fail', msg: error.array()[0].msg });
        let customer = await Customer.destroy({ where: { customerid: req.params.id } });
        if (!customer)
            return res.status(422).json({ status: 'fail', msg: 'Error while deleting customer.' });
        return res.status(200).json({ status: 'ok', msg: 'Customer deleted successfully.' });
    } catch (err) {
        console.log('error', err);
    }
}

// get customer by age 
exports.getByAge = async (req, res) => {
    try {
        let customer = await sequelize.query('select name ,  FLOOR(DATEDIFF(NOW(), DATE(dob))/365) as age from customers ;');
        console.log('customer', customer);
        if (!customer)
            return res.status(422).json({ status: 'fail', msg: 'Error while fetching customer with age.' });
        return res.status(200).json({ status: 'ok', customer: customer[0] });
    } catch (err) {
        console.log('error', err);
    }
}