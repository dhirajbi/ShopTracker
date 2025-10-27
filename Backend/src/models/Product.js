'use strict';

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		barcode: { type: String, required: true, index: true, unique: true, trim: true },
		name: { type: String, required: true, trim: true },
		description: { type: String, default: '' },
		category: { type: String, default: '' },
		price: { type: Number, required: true, min: 0 },
		quantity: { type: Number, required: true, min: 0, default: 0 },
		minThreshold: { type: Number, required: true, min: 0, default: 10 },
		expiryDate: { type: Date },
		batch: { type: String, default: '' },
		// Optional enrichment fields
		costPrice: { type: Number, min: 0, default: 0 },
		unit: { type: String, default: 'unit' },
		supplier: { type: String, default: '' },
		location: { type: String, default: '' },
		tags: { type: [String], default: [] },
		lastScannedAt: { type: Date },
	},
	{ timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; } } }
);

productSchema.virtual('id').get(function () {
	return this._id.toString();
});

productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
