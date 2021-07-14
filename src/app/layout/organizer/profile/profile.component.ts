import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../app/shared/services/auth.service';
import { CommonService } from '../../../../app/shared/services/common.service';
import { UploadService } from '../../../../app/shared/services/upload.service';
import { ValidateService } from '../../../../app/shared/services/validate.service';
import { environment } from '../../../../environments/environment';
import { Organizer } from '../../models/Organizer';

class ImageSnippet {
    constructor(public src: string, public file: File) { }
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    user: any;
    userProfile: Organizer;
    image: File;
    selectedFile: ImageSnippet;
    banks: any[] = [];
    selectedBank: any = {};
    editDialog: boolean = false;
    baseURL: string;
    professions: string[] = ['Teacher', 'Student', 'Programmer', 'Scientist'];
    @ViewChild('imageFile', { static: false }) imageFile: ElementRef;

    constructor(
        private authService: AuthService,
        private validateService: ValidateService,
        private uploadService: UploadService,
        private commenService: CommonService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.user = JSON.parse(window.localStorage.getItem('user'))
        this.baseURL = environment.baseURL;
        this.commenService.getBanks().then(banks => { this.banks = banks })

        this.authService._Get(this.user?._id, 'organizer/profile').subscribe(response => {
            if (response.success == true) {
                // console.log(response.payload);
                this.userProfile = response.payload
                if (this.userProfile?.image != undefined) this.userProfile.image = `assets/images/profiles/${this.userProfile?.image}`
                else this.userProfile.image = `assets/images/profiles/dummy.jpg`
                this.selectedBank = { id: 0, label: this.userProfile?.bname }
                console.log(this.userProfile);

            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })

    }

    showDialog() { this.editDialog = true }
    hideDialog() { this.editDialog = false; }
    onChange(event) {
        console.log(event);
        let file = event.target.files[0];
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(file.name)) {
            this.toastr.warning('Please select Image.', 'Warning')
            this.imageFile.nativeElement.value = '';
            return false;
        }
        if (event.target.files[0].size > 1000000) return this.toastr.warning('Please select Image less than 1 MB.', 'Warning')
        this.image = event.target.files[0];

        const formData = new FormData();
        formData.append('image', this.image, this.image.name);
        formData.append('id', this.userProfile._id);
        this.postRequest(formData).subscribe(response => {
            if (response.success == true) {
                console.log(response.payload);
                this.ngOnInit();
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error('error', 'Error') })


        // reader.addEventListener('load', (event: any) => {
        //     this.selectedFile = new ImageSnippet(event.target.result, file);
        //     this.uploadService._uploadFile('organizer/upload-avatar', this.selectedFile.file).subscribe(response => {
        //         if (response) {
        //             // console.log(response.payload);
        //             // this.events = response.payload
        //             this.ngOnInit();
        //         }
        //         else { console.log(response); this.toastr.warning('warning', 'Warning') }
        //     }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
        // });
        // reader.readAsDataURL(file);

    }

    changeBank(ev) {
        console.log(ev.value);
        if (ev.value == null) return this.toastr.warning('Select Bank please', 'Warning')
        this.selectedBank = ev.value
    }

    updateProfile() {
        if (!this.validateService.validateName(this.userProfile.name)) return this.toastr.warning('Name should be string', 'Validation Error')
        if (!this.validateService.validatePhone(this.userProfile.phoneno)) return this.toastr.warning('Phone is not in proper format', 'Validation Error')
        if (!this.validateService.validateName(this.userProfile.profession)) return this.toastr.warning('Profession should be string', 'Validation Error')
        if (!this.validateService.validateName(this.userProfile.accounttitle)) return this.toastr.warning('Account Title should be string', 'Validation Error')
        if (!this.validateService.validateName(this.userProfile.bname)) return this.toastr.warning('Bank Name should be string', 'Validation Error')
        if (!this.validateService.validateAccNo(this.userProfile.accountno)) return this.toastr.warning('Account No. should be 10 to 16 digit number', 'Validation Error')
        if (!this.validateService.validateNumber(this.userProfile.bcode)) return this.toastr.warning('Branch Code should be 4 Digit Number', 'Validation Error')

        const prof = {
            name: this.userProfile.name,
            email: this.userProfile.email,
            phoneno: this.userProfile.phoneno,
            dob: this.userProfile.dob,
            profession: this.userProfile.profession,
            bio: this.userProfile.bio,
            bname: this.selectedBank.label,
            bcode: this.userProfile.bcode,
            accountno: this.userProfile.accountno,
            accounttitle: this.userProfile.accounttitle,
        }

        this.authService._Put('organizer/profile/edit', this.userProfile._id, prof).subscribe(response => {
            if (response.success == true) {
                this.editDialog = false;
                this.ngOnInit();
            }
            else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
    }

    postRequest(formData): Observable<any> {
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
            xhr.open('POST', `${this.baseURL}/organizer/upload-avatar`, true);
            xhr.send(formData);
        });
    }
}
