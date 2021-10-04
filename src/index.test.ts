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

test.todo('100 Continue')
// test('100 Continue', async () => {
//   await api
//     .post('/')
//     .set({ expect: '100-continue', 'content-length': 100 })
//     .expect(100)
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

test('414 URI Too Long', async () => {
  const res = await api.get('/?Salmon_Salmon_Salmon').expect(414)

  expect(res.body.message).toMatchInlineSnapshot(
    `"URI length < 10 (/?Salmon_Salmon_Salmon) = 22"`
  )
})

test.todo('431 Request Header Fields Too Large')

test('500 Internal Server Error', async () => {
  const req = api.put('/faucet').send({ thing: 'yunomi' }).expect(200)

  api.put('/faucet').send({ thing: 'sushi' }).expect(400)
  api.put('/faucet').send({ thing: 'hand' }).expect(500)
  expect((await req).body).toMatchInlineSnapshot(`
    Object {
      "maked": "Hot Green Tea",
    }
  `)
})

test('501 Not Implemented', async () => {
  api.trace('/').expect(501)
})

test.todo('503 Service Unavailable')
