import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(
        private titleService: Title,
        private http: HttpClient
    ) { }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

    getCategories() {
        return this.http.get<any>('assets/categories.json')
            .toPromise()
            .then(res => <any[]>res.data)
            .then(data => { return data; });
    }

    getBanks() {
        return this.http.get<any>('assets/categories.json')
            .toPromise()
            .then(res => <any[]>res.banks)
            .then(banks => { return banks; });
    }

    getDurations() {
        return this.http.get<any>('assets/categories.json')
            .toPromise()
            .then(res => <any[]>res.durations)
            .then(durations => { return durations; });
    }
}
