'use strict';

const mongoose = require('mongoose');  

const stockMovementSchema = new mongoose.Schema(
	{
		productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
		type: { type: String, enum: ['in', 'out'], required: true },
		quantity: { type: Number, required: true, min: 1 },
		note: { type: String, default: '' },
	},
	{ timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; } } }
);

stockMovementSchema.virtual('id').get(function () {
	return this._id.toString();
});

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

module.exports = { StockMovement };
