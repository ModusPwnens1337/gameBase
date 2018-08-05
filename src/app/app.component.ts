import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { UberLoginPage } from '../pages/uber-login/uber-login';
import { GoogleMapsPage } from '../pages/google-maps/google-maps';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    // make LoginPage the root (or first) page
    rootPage = GoogleMapsPage;
    pages: Array<{title: string, component: any}>;

    constructor(
        public platform: Platform,
        public menu: MenuController,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen
    ) {
        this.initializeApp();

        // set our app's pages (menu??)
        this.pages = [
        { title: 'Home', component: HelloIonicPage },
        { title: 'Login', component: LoginPage },
        { title: 'Uber', component: UberLoginPage },
        { title: 'Google Maps', component: GoogleMapsPage },
        { title: 'My First List', component: ListPage }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.menu.close();
        // navigate to the new page if it is not the current page
        this.nav.setRoot(page.component);
    }
}