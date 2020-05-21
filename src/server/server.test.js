const server = require('./server');

test('server side test setup is working', () => {
  expect(server.dummyTest()).toBe("Abc");
});