import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import pool from './dbConfig/dbconnector'
import session from 'express-session'
import flash from 'express-flash'
import passport from 'passport'
import { initialize as initializePassport } from './passport/passportConfig'

initializePassport(passport)

const app = express()

const PORT = process.env.PORT || 5000

//middleware
app.set('view engine', 'ejs')
//send from frontend
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
)

let body: {
  name: string
  email: string
  password: string
  password2: string
}

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.get('/', (_req: Request, res: Response) => {
  res.render('index')
})

app.get('/users/register', (_req: Request, res: Response) => {
  res.render('register')
})

app.get('/users/login', (_req: Request, res: Response) => {
  res.render('login')
})

app.get('/users/display', (req: any, res: Response) => {
  res.render('display', { user: req.user.name })
})

app.post('/users/register', async (req: Request, res: Response) => {
  body = req.body

  console.log({ body })

  let errors: string[] = []

  if (!body.name || !body.email || !body.password || !body.password2) {
    errors.push('Please enter all fields')
  }

  if (body.password.length < 6) {
    errors.push('Please should be at least 6 character')
  }

  if (body.password != body.password2) {
    errors.push('Password do not match')
  }

  if (errors.length > 0) {
    res.render('register', { errors })
  } else {
    //passed validation
    let hashedPassword: string = await bcrypt.hash(body.password, 10)
    console.log(hashedPassword)

    pool.query(
      `SELECT * FROM users
     WHERE email = $1`,
      [body.email],
      (err, results) => {
        if (err) {
          throw err
        }
        console.log(results.rows)

        if (results.rows.length > 0) {
          errors.push('Email already exist')
          res.render('register', { errors })
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [body.name, body.email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err
              }
              console.log(results.rows)
              req.flash('success_msg', 'You are now registered. Log in')
              res.redirect('/users/login')
            }
          )
        }
      }
    )
  }
})

app.post(
  '/users/login',
  passport.authenticate('local', {
    successRedirect: '/users/display',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
)

app.listen(PORT, () => console.log(`Sever running on port ${PORT}`))
