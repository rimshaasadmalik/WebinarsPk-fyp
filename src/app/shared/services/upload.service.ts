import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    authToken: any;
    user: any;
    isDev: boolean;
    baseURL: string;

    constructor(
        private httpClient: HttpClient,
        public jwtHelper: JwtHelperService
    ) {
        this.isDev = !environment.production;
        this.baseURL = environment.baseURL;
    }

    _uploadFile(url: string, image: File): Observable<Response> {
        const formData = new FormData();
        formData.append('image', image);
        let headers = new HttpHeaders({
            'Content-Type': 'image/jpeg'
        })

        return this.httpClient.post<any>(`${this.baseURL}/${url}`, formData, { headers: headers });
    }

    _uploadImage(formData, url: string): Observable<any> {
        return Observable.create(observer => {
            var xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.open('POST', `${this.baseURL}/${url}`, true);
            xhr.send(formData);
        });
    }
}
