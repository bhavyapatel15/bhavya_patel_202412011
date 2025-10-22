const { determineSort } = require('../controllers/productController');

test('determineSort uses header x-sort asc', () => {
  const req = { headers: { 'x-sort': 'asc' }, query: {} };
  const s = determineSort(req);
  expect(s).toEqual({ price: 1 });
});

test('determineSort uses query sort asc', () => {
  const req = { headers: {}, query: { sort: 'asc' } };
  const s = determineSort(req);
  expect(s).toEqual({ price: 1 });
});

test('determineSort defaults to desc', () => {
  const req = { headers: {}, query: {} };
  const s = determineSort(req);
  expect(s).toEqual({ price: -1 });
});