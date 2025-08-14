import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? (exception.getResponse() as any)
      : { message: 'Internal server error' };

    response.status(status).json({
      statusCode: status,
      error: typeof message === 'string' ? message : message.message || message.error || 'Error',
      timestamp: new Date().toISOString(),
    });
  }
}
