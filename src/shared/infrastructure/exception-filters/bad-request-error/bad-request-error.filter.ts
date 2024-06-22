import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(BadRequestError)
export class BadRequestErrorFilter implements ExceptionFilter {
  catch(exception: BadRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: exception.message,
    });
  }
}
