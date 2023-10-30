import { Router } from 'express'
import { loginController, logoutController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { registerController } from '~/controllers/users.controllers'
import { wrapAsync } from '~/utils/handlers'
import { access } from 'fs'
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
usersRouter.get('/login', loginValidator, wrapAsync(loginController))
//usersRouter.post('/register', registerVaidator, registerController)

usersRouter.post('/register', registerValidator, wrapAsync(registerController))

/*
des: đăng xuất
path: /users/logout
method: POST
Header: {Authorization: 'Bearer <access_token>'}
body: {refesh_token: string}*/
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
export default usersRouter

//hàm bình thường có thể dùng next và throw Error
//Còn hàm async thì chỉ next không được throw
//      nếu muốn throw thì phải dùng try catch và sau khi catch được thì phải next Error
