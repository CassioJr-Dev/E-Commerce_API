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

        let entity: Object;

        let copyBody = Object.assign({}, body);
        delete copyBody?.accessToken;

        const keysUser = ['id', 'name', 'isSeller', 'email'];
        const keysProduct = ['id', 'name', 'description', 'price', 'stock'];
        const keysCart = ['id', 'user_id'];
        const keysCartItem = ['id', 'cart_id', 'product_id', 'quantity'];

        if (Array.isArray(body.data)) {
          const hasKeys = (keys: Array<String>) =>
            keys.every(key => body.data[0].hasOwnProperty(key));

          if (hasKeys(keysCartItem)) {
            return {
              data: {
                items: body.data,
              },
            };
          }
        }

        const hasKeys = (keys: Array<String>) =>
          keys.every(key => body.hasOwnProperty(key));

        if (hasKeys(keysUser)) {
          entity = { user: copyBody, accessToken: body?.accessToken };
        } else if (hasKeys(keysProduct)) {
          entity = { product: copyBody };
        } else if (hasKeys(keysCart)) {
          entity = { cart: copyBody };
        } else if (hasKeys(keysCartItem)) {
          entity = { cartItem: copyBody };
        }

        return !body || 'meta' in body ? body : { data: entity };
      }),
    );
  }
}
