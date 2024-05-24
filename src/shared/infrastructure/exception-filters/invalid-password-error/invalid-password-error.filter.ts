import { InvalidPasswordError } from '@/shared/domain/errors/invalid-password-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(InvalidPasswordError)
export class InvalidPasswordErrorFilter implements ExceptionFilter {
  catch(exception: InvalidPasswordError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(422).send({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: exception.message,
    });
  }
}
