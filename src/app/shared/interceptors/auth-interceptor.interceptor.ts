import {
    HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        const token = localStorage.getItem('token');
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTcxMmRhNjNmMmRlNTBiOGY1ZjAwNCIsImV4cGlyZXNJbiI6MjAwMDAsImlhdCI6MTYwMzc3Mjg4Mn0.aHwuDhuGF57pD4yZ3bRltmikczaSLhv_s8ndI2cH4S'
        const contentTye = request.headers.get('Content-Type');

        const apiReq = request.clone({
            url: `${request.url}`,
            setHeaders: {
                'Content-Type': contentTye || 'application/json',
                Authorization: token || ''
            }
        });
        // console.log(`NEW req url: ${apiReq.url}`);
        return next.handle(apiReq);

        // return next.handle(request);

    }
}

// if (request.url.includes('upload')) {
//     console.log('uploading image.');

//     const apiReq = request.clone({
//         url: `${request.url}`,
//         setHeaders: {
//             'Content-Type': 'application/json',
//             Authorization: token || ''
//         }, responseType: 'arraybuffer'
//     });
//     return next.handle(apiReq);
// }
