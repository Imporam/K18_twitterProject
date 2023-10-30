export const wrapAsync = (func: any) => {
  return async (req: any, res: any, next: any) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
