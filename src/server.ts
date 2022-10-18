import express, { Request, Response } from 'express'

const app = express()

const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')

app.get('/', (_req: Request, res: Response) => {
  res.render('index')
})

app.get('/users/register', (_req: Request, res: Response) => {
  res.render('register')
})

app.get('/users/login', (_req: Request, res: Response) => {
  res.render('login')
})

app.get('/users/display', (_req: Request, res: Response) => {
  res.render('display', { user: 'clinton' })
})

app.listen(PORT, () => console.log(`Sever running on port ${PORT}`))
