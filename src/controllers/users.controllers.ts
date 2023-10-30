import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody, LogoutReqBody, RegisterReqBody } from '~/models/requests/User.request'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  //vào req lấy user ra, lấy _id của user đó
  const user = req.user as User
  const user_id = user._id as ObjectId
  //dùng cái user_id đó tạo access và refresh_token
  const result = await userService.login(user_id.toString())
  //nếu ko bug gì thì thành công
  return res.status(200).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  //tạo 1 user mới và bỏ vào collection users trong database
  const result = await userService.register(req.body)
  return res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  //lấy refresh_token từ body
  const refresh_token = req.body.refresh_token
  //gọi hàm logout, hàm nhận vào refresh_token tìm và xóa
  const result = await userService.logout(refresh_token)
  res.json(result)
}
