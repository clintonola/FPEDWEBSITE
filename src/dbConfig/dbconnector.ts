import * as dotenv from 'dotenv'
dotenv.config()

import { Pool } from 'pg'

export default new Pool({
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
})
