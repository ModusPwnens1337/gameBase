import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {
    
    userData = []
    
    constructor(public navCtrl: NavController, private platform: Platform) {
        
    }

    public login() {

        this.platform.ready().then(() => {
            console.log("Game Base Login!");
            this.navCtrl.push(HelloIonicPage//, {item: item}
                              
            );
        });

    } 
}
