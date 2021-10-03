/* eslint-disable jest/expect-expect */
import request from 'supertest'
import { app } from './app'

const api = request(app)

test('200', async () => {
  const _res = await api.get('/').expect(200)
})

test('413 Payload Too Large', async () => {
  const _res = await api
    .post('/')
    .send({ large: 'a'.repeat(1024) })
    .expect(413)

  const _res2 = await api
    .post('/')
    .send({ large: 'a'.repeat(900) })
    .expect(201)
})

test('414 URI Too Long', async () => {
  const res = await api.get('/?Salmon_Salmon_Salmon').expect(414)

  expect(res.body.message).toMatchInlineSnapshot(
    `"URI length < 10 (/?Salmon_Salmon_Salmon) = 22"`
  )
  expect(res.statusCode).toBe(414)
})

test.todo('431 Request Header Fields Too Large')

test('501 Not Implemented', async () => {
  await api.trace('/').expect(501)
})

test.todo('503 Service Unavailable')
