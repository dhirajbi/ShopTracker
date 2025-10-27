'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const { connectToDatabase } = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/error');
const { apiKeyAuth } = require('./middleware/auth');
const { requestId } = require('./middleware/requestId');
const healthRouter = require('./routes/health');
const productsRouter = require('./routes/products');
const stockRouter = require('./routes/stock');
const statsRouter = require('./routes/stats');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}
app.use(requestId);
app.use(apiKeyAuth);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

app.use('/api/health', healthRouter);
app.use('/api/products', productsRouter);
app.use('/api/stock', stockRouter);
app.use('/api/stats', statsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;

function start() {
	app.listen(port, () => {
		console.log(`Server listening on http://localhost:${port}`);
		connectToDatabase().catch((err) => {
			console.error('Database connection error:', err && err.message ? err.message : err);
		});
	});
}

start();

module.exports = app;
