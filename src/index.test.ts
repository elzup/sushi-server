/* eslint-disable jest/expect-expect */
import request from 'supertest'
import { app } from './app'

const api = request(app)

test('200', async () => {
  api.get('/').expect(200)
})

test('405 Method Not Allowed', async () => {
  api.get('/faucet').expect(405)
})

// test('100 Continue', async () => {
//   await api
//     .post('/')
//     .set({ expect: '100-continue' })
//     .send({ large: 'a'.repeat(100) })
// })

test('417 Expectation Failed', async () => {
  api
    .get('/')
    .set({ expect: '100-continue', 'content-length': 2000 })
    .expect(417)
})

test('413 Payload Too Large', async () => {
  api
    .post('/')
    .send({ large: 'a'.repeat(900) })
    .expect(201)
  api
    .post('/')
    .send({ large: 'a'.repeat(1024) })
    .expect(413)
})

test('400 Bad Request', async () => {
  await api.post('/order').send({ item: 'tamago', count: 10 }).expect(201)
  await api.post('/order').send({ item: 'tamago', count: 'one' }).expect(400)
})

test('406 Not Accepted', async () => {
  await api
    .post('/order')
    .set('Accept-Charset', 'iso-8859-1')
    .send({ item: 'tamago', count: 10 })
    .expect(406)
})

test('304 Not Modified', async () => {
  const res = await api.get('/').expect(200)
  const eTag = String(res.headers.etag)

  await api
    .get('/')
    .set('If-Not-Match', eTag + '-pseudo-old')
    .expect(200)
  await api.get('/').set('If-None-Match', eTag).expect(304)
})

test('412 Precondition Failed', async () => {
  await api.get('/static/ikura.txt').expect(200)
  await api.get('/static/ikura.txt').set('If-Match', 'invalid').expect(412)
})

test('415 Unsupported Media Type', async () => {
  api
    .post('/order')
    .set('content-type', 'text/plain')
    .send('tamago')
    .expect(415)
})

test('414 URI Too Long', async () => {
  await api.get('/?' + 'a'.repeat(100)).expect(414)
})

test.todo('431 Request Header Fields Too Large')

test('202 Accepted', async () => {
  const res = await api.put('/faucet').send({ thing: 'yunomi' }).expect(202)

  expect(res.body).toMatchInlineSnapshot(`
    Object {
      "maked": "Hot Green Tea",
    }
  `)
})
test('500 Internal Server Error', async () => {
  api.put('/faucet').send({ thing: 'sushi' }).expect(400)
  api.put('/faucet').send({ thing: 'hand' }).expect(500)
})

test('501 Not Implemented', async () => {
  api.trace('/').expect(501)
})

test.todo('503 Service Unavailable')
