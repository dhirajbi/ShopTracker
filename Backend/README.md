# Shoptracker Backend (Node.js + Express + MongoDB)

## Setup
1. cd server
2. Copy .env or edit values
3. npm install
4. npm run start (or npm run dev)

.env keys:
- MONGODB_URI=mongodb://localhost:27017/shoptracker
- PORT=5000
- NODE_ENV=development
- CORS_ORIGIN=http://localhost:5173
- API_KEY= (optional; if set, send header x-api-key)

## Scripts
- npm run start
- npm run dev
- npm run seed

## Endpoints
- GET /api/health
- GET /api/products
- GET /api/products/search?q=&category=&tag=
- GET /api/products/barcode/:barcode
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- POST /api/products/scan { barcode, operation: 'in'|'out', quantity, skipUpdate?, note? }
- POST /api/stock/adjust { productId, type: 'in'|'out', quantity, note? }
- GET /api/stock/movements
- GET /api/stats

## Notes
- Responses expose `id` instead of `_id`.
- Scan route enforces 409 on insufficient stock (when operation='out').
- If `API_KEY` is set, all routes require header `x-api-key: <key>`.


