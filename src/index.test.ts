import request from 'supertest'
import { app } from './app'

test('200', async () => {
  const res = await request(app).get('/')

  expect(res.statusCode).toBe(200)
})

test('413 Payload Too Large', async () => {
  const res = await request(app)
    .post('/')
    .send({ large: 'a'.repeat(1024) })

  expect(res.statusCode).toBe(413)
  expect(res.body.message).toMatchInlineSnapshot(`undefined`)

  const res2 = await request(app)
    .post('/')
    .send({ large: 'a'.repeat(900) })

  expect(res2.statusCode).toBe(201)
  expect(res2.body.message).toMatchInlineSnapshot(`undefined`)
})

test('414 URI Too Long', async () => {
  const res = await request(app).get('/?Salmon_Salmon_Salmon')

  expect(res.body.message).toMatchInlineSnapshot(
    `"URI length < 10 (/?Salmon_Salmon_Salmon) = 22"`
  )
  expect(res.statusCode).toBe(414)
})

test.todo('431 Request Header Fields Too Large')
