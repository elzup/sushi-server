import request from 'supertest'
import { app } from './app'

test('200', async () => {
  const res = await request(app).get('/')

  expect(res.statusCode).toBe(200)
})
