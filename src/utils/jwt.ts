import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export const signToken = ({
  payLoad,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payLoad: string | object | Buffer
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payLoad, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      return resolve(token as string)
    })
  })
}
