import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/http.Status'
import { ErrorWithStatus } from '~/models/Errors'
//trong 1 cái err thì có status và message
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message)
  //nơi tập kết lỗi từ mọi nơi trên hệ thống về
  //nếu lỗi nhận được thuộc ErrorWithStatus thì trả về status và message
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  //còn nếu code mà chạy xuống được đây thì error sẽ là 1 lỗi mặc định
  //err{message, stack, name}
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  //ném lỗi cho người dùng
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack'])
  })
}
