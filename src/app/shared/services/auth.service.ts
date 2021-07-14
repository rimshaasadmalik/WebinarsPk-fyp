import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authToken: any;
    user: any;
    isDev: boolean;
    baseURL: string;
    // headers: any;

    constructor(
        private httpClient: HttpClient,
        public jwtHelper: JwtHelperService
    ) {
        this.isDev = !environment.production;
        this.baseURL = environment.baseURL;
        // this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    }

    static tokenGetter() {
        return localStorage.getItem('token');
    }

    loadToken() {
        const token = localStorage.getItem('token');
        this.authToken = token;
    }

    storeUserData(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    }

    loggedIn() {
        this.loadToken();
        if (this.authToken) {
            // console.log(this.jwtHelper.isTokenExpired(this.authToken));
            if (this.jwtHelper.isTokenExpired(this.authToken)) {
                this.logout();
                return false;
            } else {
                return true;
            }
        }
        return false;
        // this.loadToken();
        // if (this.authToken) {
        //     return !this.jwtHelper.isTokenExpired(this.authToken);
        // }
        // return false;
    }

    logout() {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    }

    _Get(id, url) {
        return this.httpClient.get<any>(`${this.baseURL}/${url}/${id}`);
    }

    _GetConds(url: string, type: string) {
        return this.httpClient.get<any>(`${this.baseURL}/${url}`, { params: { type: type } });
    }

    _Paginate(url: string, _params: any) {
        return this.httpClient.get<any>(`${this.baseURL}/${url}`, { params: { page: _params.page, limit: _params.limit } });
    }

    _GetAll(url) {
        return this.httpClient.get<any>(`${this.baseURL}/${url}`);
    }

    _Post(url, body) {
        return this.httpClient.post<any>(`${this.baseURL}/${url}`, body);
    }

    _Put(url, id, body) {
        return this.httpClient.put<any>(`${this.baseURL}/${url}/${id}`, body);
    }

    _Delete(url, id) {
        return this.httpClient.delete<any>(`${this.baseURL}/${url}/${id}`);
    }

    _DeleteBulk(url, body) {
        return this.httpClient.post<any>(`${this.baseURL}/${url}`, body);
    }

}
