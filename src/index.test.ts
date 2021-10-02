import request from 'supertest'
import { app } from './app'

test('200', async () => {
  const res = await request(app).get('/')

  expect(res.statusCode).toBe(200)
})

test('414 URI Too Long', async () => {
  const res = await request(app).get('/?Salmon_Salmon_Salmon')

  expect(res.body.message).toMatchInlineSnapshot(
    `"URI length < 10 (/?Salmon_Salmon_Salmon) = 22"`
  )
  expect(res.statusCode).toBe(414)
})
