'use strict';

const express = require('express');
const Joi = require('joi');
const { Product } = require('../models/Product');
const { StockMovement } = require('../models/StockMovement');

const router = express.Router();

const adjustSchema = Joi.object({
	productId: Joi.string().required(),
	type: Joi.string().valid('in', 'out').required(),
	quantity: Joi.number().integer().min(1).required(),
	note: Joi.string().allow('').optional(),
});

router.post('/adjust', async (req, res, next) => {
	try {
		const { error, value } = adjustSchema.validate(req.body, { abortEarly: false, convert: true });
		if (error) {
			return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
		}

		const product = await Product.findById(value.productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		let newQuantity = product.quantity;
		if (value.type === 'in') {
			newQuantity += value.quantity;
		} else {
			newQuantity = Math.max(0, product.quantity - value.quantity);
		}

		product.quantity = newQuantity;
		await product.save();

		const movement = await StockMovement.create({
			productId: product._id,
			type: value.type,
			quantity: value.quantity,
			note: value.note || '',
		});

		res.status(201).json({ product, movement });
	} catch (err) {
		next(err);
	}
});

router.get('/movements', async (req, res, next) => {
	try {
		const items = await StockMovement.find({}).sort({ createdAt: -1 }).limit(100).populate('productId');
		res.json(items);
	} catch (err) {
		next(err);
	}
});

module.exports = router;


