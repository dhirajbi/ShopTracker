'use strict';

function notFoundHandler(req, res, next) {
	res.status(404).json({
		status: 404,
		error: 'Not Found',
		message: `Cannot ${req.method} ${req.originalUrl}`,
	});
}

function errorHandler(err, req, res, next) {
	const status = err.status || err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	const response = { status, error: status >= 500 ? 'Server Error' : 'Request Error', message };
	if (process.env.NODE_ENV !== 'production' && err.stack) {
		response.stack = err.stack;
	}
	res.status(status).json(response);
}

module.exports = { notFoundHandler, errorHandler };


