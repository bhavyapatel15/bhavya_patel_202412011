const { determineSort } = require('../controllers/productController');
function makeReq(headers, query) {
  return { headers: headers || {}, query: query || {} };
}
test('default sorting is descending by price', () => {
  const req = makeReq({}, {});
  const sort = determineSort(req);
  expect(sort).toEqual({ price: -1 });
});
test('x-sort header asc results in ascending price sort', () => {
  const req = makeReq({ 'x-sort': 'asc' }, {});
  const sort = determineSort(req);
  expect(sort).toEqual({ price: 1 });
});
test('query param sort=asc results in ascending price sort', () => {
  const req = makeReq({}, { sort: 'asc' });
  const sort = determineSort(req);
  expect(sort).toEqual({ price: 1 });
});
