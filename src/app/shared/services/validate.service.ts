import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ValidateService {

    constructor() { }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validatePhone(phone) {
        // console.log('hi');
        // const re = /\d{4}\d{7}/;
        // const re = /^\d{11}$/;
        const re = /^03[0-6]\d{8}$/;
        return re.test(phone);
    }

    validateName(name) {
        // console.log('hi');
        const re = /^[a-zA-Z_ ]*$/;
        return re.test(name);
    }

    validateOTP(otp) {
        const re = /^\d{4}$/;
        return re.test(otp);
    }

    validateNumber(no) {
        const re = /^\d{4}$/;
        return re.test(no);
    }

    validateNumberOnly(no) {
        const re = /^[1-9]\d*$/;
        return re.test(no);
    }

    validateZip(zip) {
        const re = /^\d{5}$/;
        return re.test(zip);
    }

    validatePassword(pwd) {
        const re = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        return re.test(pwd);
    }

    validateAccNo(no) {
        const re = /^\d{10,16}$/;
        return re.test(no);
    }
}
