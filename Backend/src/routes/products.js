'use strict';

const express = require('express');
const Joi = require('joi');
const { Product } = require('../models/Product');
const { StockMovement } = require('../models/StockMovement');

const router = express.Router();

const productSchema = Joi.object({
	barcode: Joi.string().trim().required(),
	name: Joi.string().trim().required(),
	description: Joi.string().allow('').optional(),
	category: Joi.string().allow('').optional(),
	price: Joi.number().min(0).required(),
	quantity: Joi.number().min(0).required(),
	minThreshold: Joi.number().min(0).required(),
	expiryDate: Joi.date().optional().allow(null, ''),
	batch: Joi.string().allow('').optional(),
	costPrice: Joi.number().min(0).optional(),
	unit: Joi.string().optional(),
	supplier: Joi.string().allow('').optional(),
	location: Joi.string().allow('').optional(),
	tags: Joi.array().items(Joi.string()).optional(),
	lastScannedAt: Joi.date().optional(),
});

const scanSchema = Joi.object({
	barcode: Joi.alternatives().try(Joi.string().trim(), Joi.number()).required(),
	operation: Joi.string().valid('in', 'out').default('out'),
	quantity: Joi.number().integer().min(1).default(1),
	note: Joi.string().allow('').optional(),
	skipUpdate: Joi.boolean().default(false),
});

router.get('/', async (req, res, next) => {
	try {
		const products = await Product.find({}).sort({ createdAt: -1 });
		res.json(products);
	} catch (err) {
		next(err);
	}
});

router.get('/search', async (req, res, next) => {
	try {
		const { q, category, tag } = req.query;
		const filter = {};
		if (q && String(q).trim()) {
			filter.$text = { $search: String(q).trim() };
		}
		if (category) filter.category = category;
		if (tag) filter.tags = tag;
		const products = await Product.find(filter).sort({ createdAt: -1 }).limit(100);
		res.json(products);
	} catch (err) {
		next(err);
	}
});

router.post('/scan', async (req, res, next) => {
	try {
		const { error, value } = scanSchema.validate(req.body, { abortEarly: false, convert: true });
		if (error) {
			return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
		}

		const normalizedBarcode = String(value.barcode);
		const product = await Product.findOne({ barcode: normalizedBarcode });
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Always track last scanned time
		product.lastScannedAt = new Date();

		let movement = null;
		if (!value.skipUpdate) {
			if (value.operation === 'in') {
				product.quantity += value.quantity;
			} else {
				if (value.quantity > product.quantity) {
					return res.status(409).json({ message: 'Insufficient stock' });
				}
				product.quantity -= value.quantity;
			}
			await product.save();
			movement = await StockMovement.create({
				productId: product._id,
				type: value.operation,
				quantity: value.quantity,
				note: value.note || 'scan',
			});
		} else {
			await product.save();
		}

		return res.json({ product, movement });
	} catch (err) {
		next(err);
	}
});

router.get('/barcode/:barcode', async (req, res, next) => {
	try {
		const product = await Product.findOne({ barcode: req.params.barcode });
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.json(product);
	} catch (err) {
		next(err);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.json(product);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { error, value } = productSchema.validate(req.body, { abortEarly: false, convert: true });
		if (error) {
			return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
		}
		const created = await Product.create(value);
		res.status(201).json(created);
	} catch (err) {
		if (err && err.code === 11000) {
			return res.status(409).json({ message: 'Barcode already exists' });
		}
		next(err);
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const { error, value } = productSchema.validate(req.body, { abortEarly: false, convert: true });
		if (error) {
			return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
		}
		const updated = await Product.findByIdAndUpdate(req.params.id, value, { new: true });
		if (!updated) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.json(updated);
	} catch (err) {
		next(err);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const deleted = await Product.findByIdAndDelete(req.params.id);
		if (!deleted) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.status(204).send();
	} catch (err) {
		next(err);
	}
});

module.exports = router;
