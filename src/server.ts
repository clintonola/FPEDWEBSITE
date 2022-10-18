import express, { Response } from 'express'

const app = express()

const PORT = process.env.PORT || 5000

app.get('/', (res: Response) => {
  res.send('hello')
})

app.listen(PORT, () => console.log(`Sever running on port ${PORT}`))
