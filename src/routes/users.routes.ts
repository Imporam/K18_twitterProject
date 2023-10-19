import { Router } from 'express'
import { loginController } from '~/controllers/users.controllers'
import { loginValidator, registerVaidator } from '~/middlewares/users.middlewares'
import { registerController } from '~/controllers/users.controllers'
const usersRouter = Router()
//-------------------------------  ví dụ middleware
//usersRouter sử dụng 1 middleware
// usersRouter.use((req, res, next) => {
//   console.log('Time: ', Date.now())
//   next()
// })

// usersRouter.use(
//   (req, res, next) => {
//     console.log('Time: ', Date.now())
//     //res.status(400).send('not allowed')
//     next()
//   },
//   (req, res, next) => {
//     console.log('Time2: ', Date.now())
//     next()
//   }
// )
//---------------------------------------------------
usersRouter.get('/login', loginValidator, loginController)
usersRouter.post('/register', registerVaidator, registerController)

export default usersRouter
