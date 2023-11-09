import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import argv from 'minimist'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json())
initFolder()
databaseService.connect()
app.get('/', (req, res) => {
  res.send('hello world')
})

console.log(process.argv)
const options = argv(process.argv.slice(2))
console.log(options)
app.use(express.json()) //app handler

//app sử dụng một error handler tổng

//làm hàm nhận vào requestHandler dùng trycatch
//  try{
//  requestHandler()
//}catch(error){
//  next(error)
//}

//app tổng sẽ dùng usersRouter trên nên ta sẽ có 1 đường dẫn là /api/tweets
//nên lúc muốn xài api tweets thì ta phải truy cập bằng
//localhost:3000/api/tweets

app.use('/users', usersRouter) //route handler
app.use('/medias', mediasRouter) //route handler
app.use('/static', staticRouter)
app.use('/users', usersRouter)
app.use(defaultErrorHandler)
//app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
// tạo folder uploads

// app.use('/static', express.static(UPLOAD_IMAGE_DIR)) //nếu muốn thêm tiền tố, ta sẽ làm thế này
//vậy thì nghĩa là vào localhost:4000/static/blablabla.jpg

app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
