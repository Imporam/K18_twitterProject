import { Request, Response, NextFunction } from 'express'
import formidable from 'formidable'
import path from 'path'
export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  //const formidable = (await import('formidable')).default
  //ta có các biến sau
  //__dirname : chứa đường dẫn tuyệt đối đến thư mục chứa file đang chạy
  //path.resolve('uploads') đây là đường dẫn mà mình muốn làm chỗ lưu file
  const form = formidable({
    uploadDir: path.resolve('uploads'), //lưu ở đâu
    maxFiles: 1, //tối đa bao nhiêu
    keepExtensions: true, //có lấy đuôi mở rộng không .png, .jpg
    maxFileSize: 300 * 1024 //tối đa bao nhiêu byte, 300kb
  })
  //đoạn này là xử lý khi có lỗi: lụm từ doc của formidable
  form.parse(req, (err, fields, files) => {
    //files là object chứa các file tải lên
    //nếu k upload file thì object rỗng {}
    if (err) {
      throw err
    }
    res.json({
      message: 'upload image successfully'
    })
  })
}
