import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import getRawBody from 'raw-body'


@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    public use(req: Request, res: Response, next: NextFunction) {
        if (!req.readable) {
            return next(new BadRequestException('Invalid data from Request.'))
        }

        getRawBody(req, { encoding: 'utf-8' }).then(rawBody => {
            req.body = rawBody
            next()
        }).catch(error => {
            next(new BadRequestException('Error from request', error))
        })
    }
}