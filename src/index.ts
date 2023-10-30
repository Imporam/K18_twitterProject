import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()
const PORT = 3000
app.use(express.json())
databaseService.connect()
app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter)

//app sử dụng một error handler tổng
app.use(defaultErrorHandler)

//làm hàm nhận vào requestHandler dùng trycatch
//  try{
//  requestHandler()
//}catch(error){
//  next(error)
//}

//app tổng sẽ dùng usersRouter trên nên ta sẽ có 1 đường dẫn là /api/tweets
//nên lúc muốn xài api tweets thì ta phải truy cập bằng
//localhost:3000/api/tweets
app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
