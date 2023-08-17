import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(BadRequestExceptionFilter.name);

  catch(exception: any, context: ArgumentsHost) {
    const error = exception?.getResponse();
    const callback = context.getArgByIndex(2);
    this.logger.log('ERROR', error);
    if (callback && typeof callback === 'function') {
      callback({ hasError: true, errors: error.message ?? [] });
    }
  }
}
