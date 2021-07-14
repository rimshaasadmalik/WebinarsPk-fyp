import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { AuthInterceptorInterceptor } from './shared/interceptors/auth-interceptor.interceptor';
import { AuthService } from './shared/services/auth.service';
import { MessagingService } from './shared/services/messaging.service';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        // LanguageTranslationModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireMessagingModule,
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: AuthService.tokenGetter
            }
        }),
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            autoDismiss: true,
            closeButton: true,
            easing: 'ease-in'
        }),
        NgxSpinnerModule
    ],
    declarations: [AppComponent],
    providers: [AuthGuard, Title, AuthService, MessagingService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule { }
