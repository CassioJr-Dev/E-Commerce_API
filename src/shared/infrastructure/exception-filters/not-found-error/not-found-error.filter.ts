import { NotFoundError } from "@/shared/domain/errors/not-found-error"
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message,
    })
  }
}
