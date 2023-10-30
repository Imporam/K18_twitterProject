import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
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

/*des: verify email,
khi người dùng đăng ký, trong email của họ sẽ có 1 link
trong link này đã setup sẵn 1 request kèm email_verify_token
thì verify email là cái route cho request đó
method: POST
path: /users/verify-email
body: {email_verify_token: string}
*/
usersRouter.post('/verify-email', emailVerifyValidator, wrapAsync(emailVerifyController))

//hàm bình thường có thể dùng next và throw Error
//Còn hàm async thì chỉ next không được throw
//      nếu muốn throw thì phải dùng try catch và sau khi catch được thì phải next Error

/*
des: resend email verify
mehtod: POST
headers: {Authorization: Bearer <access_token>} */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*
des: cung cấp email để reset password, gữi email cho người dùng
path: /forgot-password
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {email: string}
*/
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
des: Verify link in email to reset password
path: /verify-forgot-password
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string}
*/
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

export default usersRouter
