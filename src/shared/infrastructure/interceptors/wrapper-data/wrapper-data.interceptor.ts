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
        if (typeof body === 'string' || typeof body === 'number' || typeof body === 'boolean') {
          return body;
        }

        return !body || 'accessToken' in body || 'meta' in body
          ? body
          : { data: body };
      }),
    );
  }
}
