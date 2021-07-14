import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../app/shared/services/auth.service';
declare var JitsiMeetExternalAPI: any;

@Component({
    selector: 'app-webinar',
    templateUrl: './webinar.component.html',
    styleUrls: ['./webinar.component.scss']
})
export class WebinarComponent implements OnInit, AfterViewInit {

    domain: string = "meet.jit.si"; // For self hosted use your domain
    room: any;
    options: any;
    api: any;
    user: any;
    eventId: string;

    // For Custom Controls
    isAudioMuted = false;
    isVideoMuted = false;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.eventId = this.route.snapshot.paramMap.get('id')
        this.user = JSON.parse(window.localStorage.getItem('user'))
        // console.log(this.eventId, this.user);

        // this.authService._Get('60832e4f5306db3e90773149', 'stream/room').subscribe(response => {
        //     if (response.success == true) {
        //         console.log(response.payload);
        //         this.room = response.payload?.result?.roomId;
        //         this.user = {
        //             name: response.payload?.viewer?.name
        //         }
        //         console.log({ roomsId: this.room, userName: this.user });

        //     }
        //     else { console.log(response); this.toastr.warning(response.message, 'Warning') }
        // }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
        // this.room = 'webinar-room'; // Set your room name
        // this.user = {
        //     name: 'Tayyab Mirza' // Set your username
        // }
        // console.log(this.room, this.user);
    }

    ngAfterViewInit(): void {
        if (this.user?.role == 'organizer') {
            this.authService._Post('stream/organizer/room', { eventId: this.eventId, userId: this.user?._id }).subscribe(response => {
                if (response.success == true) {
                    console.log(response.payload);
                    // console.log(this.room, this.user);
                    this.options = {
                        roomName: response.payload?.result?.roomId, // this.room,
                        width: 900,
                        height: 500,
                        configOverwrite: { prejoinPageEnabled: false },
                        interfaceConfigOverwrite: {
                            // overwrite interface properties
                        },
                        parentNode: document.querySelector('#jitsi-iframe'),
                        userInfo: {
                            displayName: response.payload?.organizer?.name //this.user?.name
                        }
                    }
                    // console.log(this.options);
                    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
                    this.api.addEventListeners({
                        readyToClose: this.handleClose,
                        participantLeft: this.handleParticipantLeft,
                        participantJoined: this.handleParticipantJoined,
                        videoConferenceJoined: this.handleVideoConferenceJoined,
                        videoConferenceLeft: this.handleVideoConferenceLeft,
                        audioMuteStatusChanged: this.handleMuteStatus,
                        videoMuteStatusChanged: this.handleVideoStatus
                    });
                }
                else { console.log(response); this.toastr.warning(response.message, 'Warning') }
            }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
        } else {
            this.authService._Post('stream/room', { event: this.eventId, user: this.user._id }).subscribe(response => {
                if (response.success == true) {
                    console.log(response.payload);
                    // this.room = response.payload?.result?.roomId;
                    // this.user = {
                    //     name: response.payload?.viewer?.name
                    // }
                    console.log(this.room, this.user);
                    this.options = {
                        roomName: response.payload?.result?.roomId, // this.room,
                        width: 900,
                        height: 500,
                        configOverwrite: { prejoinPageEnabled: false },
                        interfaceConfigOverwrite: {
                            // overwrite interface properties
                        },
                        parentNode: document.querySelector('#jitsi-iframe'),
                        userInfo: {
                            displayName: response.payload?.viewer?.name //this.user?.name
                        }
                    }
                    console.log(this.options);
                    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
                    this.api.addEventListeners({
                        readyToClose: this.handleClose,
                        participantLeft: this.handleParticipantLeft,
                        participantJoined: this.handleParticipantJoined,
                        videoConferenceJoined: this.handleVideoConferenceJoined,
                        videoConferenceLeft: this.handleVideoConferenceLeft,
                        audioMuteStatusChanged: this.handleMuteStatus,
                        videoMuteStatusChanged: this.handleVideoStatus
                    });
                }
                else { console.log(response); this.toastr.warning(response.message, 'Warning') }
            }, error => { console.log(error); this.toastr.error(error.error.message, 'Error') })
        }
        // this.options = {
        //     roomName: this.room,
        //     width: 900,
        //     height: 500,
        //     configOverwrite: { prejoinPageEnabled: false },
        //     interfaceConfigOverwrite: {
        //         // overwrite interface properties
        //     },
        //     parentNode: document.querySelector('#jitsi-iframe'),
        //     userInfo: {
        //         displayName: this.user?.name
        //     }
        // }
        // console.log(this.options);


        // this.api = new JitsiMeetExternalAPI(this.domain, this.options);

        // Event handlers
        // this.api.addEventListeners({
        //     readyToClose: this.handleClose,
        //     participantLeft: this.handleParticipantLeft,
        //     participantJoined: this.handleParticipantJoined,
        //     videoConferenceJoined: this.handleVideoConferenceJoined,
        //     videoConferenceLeft: this.handleVideoConferenceLeft,
        //     audioMuteStatusChanged: this.handleMuteStatus,
        //     videoMuteStatusChanged: this.handleVideoStatus
        // });

    }

    handleClose = () => {
        console.log("handleClose");
    }

    handleParticipantLeft = async (participant) => {
        console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
        const data = await this.getParticipants();
    }

    handleParticipantJoined = async (participant) => {
        console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
        const data = await this.getParticipants();
    }

    handleVideoConferenceJoined = async (participant) => {
        console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
        const data = await this.getParticipants();
    }

    handleVideoConferenceLeft = () => {
        console.log("handleVideoConferenceLeft");
        this.router.navigate(['/thank-you']);
    }

    handleMuteStatus = (audio) => {
        console.log("handleMuteStatus", audio); // { muted: true }
    }

    handleVideoStatus = (video) => {
        console.log("handleVideoStatus", video); // { muted: true }
    }

    getParticipants() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    executeCommand(command: string) {
        this.api.executeCommand(command);;
        if (command == 'hangup') {
            this.router.navigate(['/thank-you']);
            return;
        }

        if (command == 'toggleAudio') {
            this.isAudioMuted = !this.isAudioMuted;
        }

        if (command == 'toggleVideo') {
            this.isVideoMuted = !this.isVideoMuted;
        }
    }
}
