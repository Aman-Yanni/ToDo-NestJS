import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getStatusCode = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (exception: unknown): string => {
  if (exception instanceof HttpException) {
    return String(exception.message);
  }
  else {
    return String(exception)
  }
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = getStatusCode(exception);
    const message = exception.response.message;
    const request = ctx.getRequest<IncomingMessage>();

    response.status(status).json({
      success: false,
      status,
      errors: message
    });

    // response.status(status).json({
    //   success: false,
    //   status,
    //   errors: message
    // });
  }
}