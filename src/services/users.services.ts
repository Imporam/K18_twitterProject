import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payLoad: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payLoad: { user_id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payLoad: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payLoad,
        date_of_birth: new Date(payLoad.date_of_birth),
        password: hashPassword(payLoad.password)
      })
    )
    //lấy user_id từ account vừa tạo
    const user_id = result.insertedId.toString()
    //từ user_id tạo ra access token và 1 refresh token
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    //lưu vào database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    return { access_token, refresh_token }
  }
  async checkEmailExist(email: string) {
    //vào databasse tìm user có email
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async login(user_id: string) {
    //dùng cái user_id đó tạo access_token và refresh_token
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    //lưu vào database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )

    return { access_token, refresh_token }
    //return access_token ra cho client
  }

  async logout(refesh_token: string) {
    //dùng refresh_token tìm và xóa
    await databaseService.refreshTokens.deleteOne({ token: refesh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
}

const userService = new UserService()
export default userService
