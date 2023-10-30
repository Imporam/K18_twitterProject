//ở đây thường mình sẽ extend Error để nhận đc báo lỗi ở dòng nào
import HTTP_STATUS from '~/constants/http.Status'
import { USERS_MESSAGES } from '~/constants/messages'
type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

//tạo class khuyên dùng để tạo ra lỗi
export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorType
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY }) //422
    this.errors = errors
  }
}
