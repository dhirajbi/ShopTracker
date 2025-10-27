'use strict';

function apiKeyAuth(req, res, next) {
	const configuredKey = process.env.API_KEY;
	if (!configuredKey) return next();
	const provided = req.header('x-api-key');
	if (provided && provided === configuredKey) return next();
	return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = { apiKeyAuth };


