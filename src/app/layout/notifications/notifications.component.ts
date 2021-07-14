import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessagingService } from '../../shared/services/messaging.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
    messages: any[] = [];
    message;
    constructor(
        private messagingService: MessagingService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
         this.message = this.messagingService.currentMessage
        // this.messages.push(message)
        // console.log(message);

        // this.toastr.info()
    }

}
