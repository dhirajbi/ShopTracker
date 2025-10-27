'use strict';

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const { Product } = require('../src/models/Product');

async function main() {
	const uri = process.env.MONGODB_URI;
	if (!uri) throw new Error('MONGODB_URI not set');
	await mongoose.connect(uri);

	const demo = [
		{
			barcode: '123456789',
			name: 'Organic Milk',
			description: '1L organic whole milk',
			category: 'Dairy',
			price: 414.17,
			quantity: 25,
			minThreshold: 10,
			expiryDate: new Date('2025-01-15'),
			batch: 'BATCH001',
			costPrice: 290.50,
			unit: 'liter',
			supplier: 'Organic Farms Co.',
			location: 'Refrigerator A1',
			tags: ['organic', 'dairy', 'fresh']
		},
		{
			barcode: '987654321',
			name: 'Whole Wheat Bread',
			description: 'Fresh baked whole wheat bread',
			category: 'Bakery',
			price: 289.67,
			quantity: 8,
			minThreshold: 10,
			expiryDate: new Date('2025-01-10'),
			batch: 'BATCH002',
			costPrice: 166.00,
			unit: 'loaf',
			supplier: 'Local Bakery',
			location: 'Shelf B2',
			tags: ['bread', 'wheat', 'fresh']
		},
		{
			barcode: '456789123',
			name: 'Bananas',
			description: 'Fresh organic bananas',
			category: 'Produce',
			price: 248.17,
			quantity: 50,
			minThreshold: 20,
			expiryDate: new Date('2025-01-08'),
			batch: 'BATCH003',
			costPrice: 124.50,
			unit: 'bunch',
			supplier: 'Tropical Fruits Ltd.',
			location: 'Produce Section',
			tags: ['fruit', 'organic', 'tropical']
		},
		{
			barcode: '789123456',
			name: 'Chicken Breast',
			description: 'Fresh chicken breast fillets',
			category: 'Meat',
			price: 746.17,
			quantity: 15,
			minThreshold: 5,
			expiryDate: new Date('2025-01-12'),
			batch: 'BATCH004',
			costPrice: 498.00,
			unit: 'kg',
			supplier: 'Premium Meats',
			location: 'Freezer C1',
			tags: ['meat', 'chicken', 'protein']
		},
		{
			barcode: '321654987',
			name: 'Pasta Sauce',
			description: 'Tomato basil pasta sauce',
			category: 'Pantry',
			price: 206.67,
			quantity: 30,
			minThreshold: 15,
			expiryDate: new Date('2025-06-01'),
			batch: 'BATCH005',
			costPrice: 99.60,
			unit: 'jar',
			supplier: 'Italian Foods Co.',
			location: 'Aisle 3',
			tags: ['sauce', 'pasta', 'italian']
		},
		{
			barcode: '654987321',
			name: 'Olive Oil',
			description: 'Extra virgin olive oil',
			category: 'Pantry',
			price: 1078.17,
			quantity: 5,
			minThreshold: 8,
			expiryDate: new Date('2025-12-01'),
			batch: 'BATCH006',
			costPrice: 664.00,
			unit: 'bottle',
			supplier: 'Mediterranean Imports',
			location: 'Aisle 2',
			tags: ['oil', 'cooking', 'premium']
		}
	];

	await Product.deleteMany({ barcode: { $in: demo.map(d => d.barcode) } });
	await Product.insertMany(demo);
	console.log('Seeded products:', demo.length);
	await mongoose.disconnect();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});


