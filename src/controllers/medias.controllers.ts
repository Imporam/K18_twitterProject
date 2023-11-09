import { Request, Response, NextFunction } from 'express'
import formidable from 'formidable'
import path from 'path'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'
import { handleUploadImage } from '~/utils/file'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/http.Status'
import fs from 'fs'
import mime from 'mime'
// export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
//   //const formidable = (await import('formidable')).default
//   //ta có các biến sau
//   //__dirname : chứa đường dẫn tuyệt đối đến thư mục chứa file đang chạy
//   //path.resolve('uploads') đây là đường dẫn mà mình muốn làm chỗ lưu file
//   const form = formidable({
//     uploadDir: path.resolve('uploads'), //lưu ở đâu
//     maxFiles: 1, //tối đa bao nhiêu
//     keepExtensions: true, //có lấy đuôi mở rộng không .png, .jpg
//     maxFileSize: 300 * 1024 //tối đa bao nhiêu byte, 300kb
//   })
//   //đoạn này là xử lý khi có lỗi: lụm từ doc của formidable
//   form.parse(req, (err, fields, files) => {
//     //files là object chứa các file tải lên
//     //nếu k upload file thì object rỗng {}
//     if (err) {
//       throw err
//     }
//     res.json({
//       message: 'upload image successfully'
//     })
//   })
// }
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: data
  })
}
export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { namefile } = req.params //lấy namefile từ param string
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, namefile), (error) => {
    console.log(error) //xem lỗi trong như nào, nếu ta bỏ sai tên file / xem xong nhớ cmt lại cho đở rối terminal
    if (error) {
      return res.status((error as any).status).send('File not found')
    }
  }) //trả về file
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req) //uploadVideo chưa làm
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveVideoStreamController = (req: Request, res: Response, next: NextFunction) => {
  const { namefile } = req.params
  const range = req.headers.range // lấy range từ trong headers ra
  console.log(range)

  //lấy đường dẫ tới video đó
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, namefile)
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Required range header')
  }

  //tổng dung lượng của video đó
  const videoSize = fs.statSync(videoPath).size
  //chunksize là khi video tới gần byte đến thì sẽ đc load thêm byte để video đc tiếp tục
  const CHUNK_SIZE = 10 ** 6 //1MB

  //range: bytes = 12121- 31231231/31231231
  const start = Number(range.replace(/\D/g, ''))

  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

  //dung lượng sẽ load thực tế
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers) //trả về phần nội dung
  //khai báo trong httpStatus.ts PARTIAL_CONTENT = 206: nội dung bị chia cắt nhiều đoạn
  const videoStreams = fs.createReadStream(videoPath, { start, end }) //đọc file từ start đến end
  videoStreams.pipe(res)
  //pipe: đọc file từ start đến end, sau đó ghi vào res để gữi cho client
}
