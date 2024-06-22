import { ForbiddenError } from '@/shared/domain/errors/forbidden-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(ForbiddenError)
export class ForbiddenErrorFilter implements ExceptionFilter {
  catch(exception: ForbiddenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: exception.message,
    });
  }
}
