'use strict';

const express = require('express');
const { Product } = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const totalProducts = await Product.countDocuments();
		const lowStockItems = await Product.countDocuments({ $expr: { $lte: ['$quantity', '$minThreshold'] }, quantity: { $gt: 0 } });
		const outOfStockItems = await Product.countDocuments({ quantity: 0 });

		const today = new Date();
		const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
		const expiringItems = await Product.countDocuments({ expiryDate: { $gte: today, $lte: sevenDaysLater } });

		res.json({ totalProducts, lowStockItems, outOfStockItems, expiringItems });
	} catch (err) {
		next(err);
	}
});

module.exports = router;


