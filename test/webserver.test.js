const http = require('http')

describe('Start testing the Start of the web server tests.', () => {
  test('Testing the availability of the API server', (done) => {
    http.get({
      hostname: 'pied.local',
      port: 80,
      path: '/',
    }, (res) => {
      expect(res.statusCode).toBe(200);
      done()
    })
  });

  test('Testing the availability of the web server (Frontend)', (done) => {
    http.get({
      hostname: 'pied.local',
      port: 8080,
      path: '/',
    }, (res) => {
      expect(res.statusCode).toBe(200);
      done()
    })
  })
})