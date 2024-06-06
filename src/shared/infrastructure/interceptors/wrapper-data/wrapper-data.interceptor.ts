import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class WrapperDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(body => {
        // Handle null or undefined body
        if (body === null || body === undefined) {
          return body;
        }

        // Handle primitive types (string, number, boolean, etc.)
        if (
          typeof body === 'string' ||
          typeof body === 'number' ||
          typeof body === 'boolean'
        ) {
          return body;
        }

        let user: Object;

        let copyBody = Object.assign({}, body);
        delete copyBody?.accessToken;

        const keys = ['id', 'name', 'isSeller', 'email'];

        if (keys.every(key => body.hasOwnProperty(key))) {
          user = { user: copyBody, accessToken: body?.accessToken };
        }

        return !body || 'meta' in body ? body : { data: user };
      }),
    );
  }
}
