import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayload } from '~/models/requests/User.request'
config()

export const signToken = ({
  payLoad,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payLoad: string | object | Buffer
  privateKey: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payLoad, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      return resolve(token as string)
    })
  })
}
//hàm kiểm tra toen có phải của mình tạo ra không
//nếu có thì trả ra payLoad
export const verifyToken = ({ token, secretOrPublickey }: { token: string; secretOrPublickey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublickey, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as TokenPayload)
    })
  })
}
