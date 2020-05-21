const dateUtils = require('./dateUtils');

test('getHistoricalDate returns same day as given but a year ago', () => {
  expect(dateUtils.getHistoricalDate("2028-07-07").toISOString()).toBe("2019-07-06T22:00:00.000Z");
});