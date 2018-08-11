import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

// pages
import { LoginPage } from '../pages/login/login';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { UberLoginPage } from '../pages/uber-login/uber-login';
import { GoogleMapsPage } from '../pages/google-maps/google-maps';

//native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

//firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

var firebaseConfig = {
    apiKey: "AIzaSyAg0OsCkM8mj3TIpPG8pHfE7tlKwUQDcOw",
    authDomain: "gamebase-a1138.firebaseapp.com",
    databaseURL: "https://gamebase-a1138.firebaseio.com",
    projectId: "gamebase-a1138",
    storageBucket: "gamebase-a1138.appspot.com",
    messagingSenderId: "1057220692182"
};

@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        HelloIonicPage,
        UberLoginPage,
        GoogleMapsPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        HelloIonicPage,
        UberLoginPage,
        GoogleMapsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
