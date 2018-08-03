import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { LoginPage } from '../pages/login/login';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { UberLoginPage } from '../pages/uber-login/uber-login';
import { GoogleMapsPage } from '../pages/google-maps/google-maps';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

var config = {
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
        GoogleMapsPage,
        ItemDetailsPage,
        ListPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(config)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        HelloIonicPage,
        UberLoginPage,
        GoogleMapsPage,
        ItemDetailsPage,
        ListPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
