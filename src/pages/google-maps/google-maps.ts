import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Events } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

declare var window: any;
declare var google;

@Component({
    selector: 'page-google-maps',
    templateUrl: 'google-maps.html'
})

export class GoogleMapsPage {
  
    userData = [];
    rideHistory = [];
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    
    constructor(public navCtrl: NavController, private platform: Platform, private fireDB: AngularFireDatabase, public geolocation: Geolocation, public events: Events) {
        
        this.fireDB.list("/users").valueChanges().subscribe((data) => { 
            this.userData = data;
            console.log(this.userData);
        });
        
        events.subscribe('marker:added', (lat, long) => {
            // user and time are the same arguments passed in `events.publish(user, time)`
            console.log('marker lat', lat, ', long', long);
            this.addMarker(lat, long)
        });
        
    }
  
    ionViewDidLoad(){
        this.loadMap();
    }
  
    loadMap(){

        this.geolocation.getCurrentPosition().then((position) => {

            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        }, (err) => {
            console.log(err);
        });

    }
    
    addMarker(lat, long){
        
//        debugger;
        
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });
        
        if (lat && long) {
            let pos = {lat: lat, lng: long};
            marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: pos
            });
        }

        let content = "<h4>Information!</h4>";         

        this.addInfoWindow(marker, content);

    }
    
    addInfoWindow(marker, content){
 
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }  

    public login() {

        this.platform.ready().then(() => {
            this.uberAuthenticate(this).then(success => {
                console.log("success: " + success.code); 
            }, (error) => {
                alert(error);
            });
        });

    }
    
    uberGetUser(self, accessTkn) {
        ///USE bearer token
        var profileReq = new XMLHttpRequest();
        profileReq.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var uberUser = JSON.parse(profileReq.responseText);
                console.log("uberUser Obj: " + uberUser);
                // save to array to display
                self.userData[0] = uberUser;
                console.log(self.userData);
                // save user to db.
                self.fireDB.database.ref('/users/').set({uberUser});
            }
        };
        profileReq.open('GET', 'https://api.uber.com/v1.2/me?latitude=37.7759792&longitude=-122.41823&access_token='+accessTkn);
        profileReq.send();
    }
    
    uberGetRideHistory(self, accessTkn) {
        ///USE bearer token
        var histReq = new XMLHttpRequest();
        histReq.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                self.fireDB.database.ref('/rideHistory/').remove();
                var historyObj = JSON.parse(histReq.responseText);
                console.log("historyObj: " + historyObj);
                for ( var i=0; i < historyObj.history.length; i++ ) {
                    self.events.publish('marker:added', historyObj.history[i].start_city.latitude, historyObj.history[i].start_city.longitude);
                    //add display_name to array of objects
                    var dispObj = { city: historyObj.history[i].start_city.display_name };
                    self.rideHistory[i] = dispObj;
                    // save history to db.
                    var histObj = [];
                    histObj = historyObj.history[i];
                    self.fireDB.database.ref('/rideHistory/').push({histObj});
                }
                console.log(self.rideHistory);
            }
        };
        histReq.open('GET', 'https://api.uber.com/v1.2/history?limit=50&latitude=37.7759792&longitude=-122.41823&access_token='+accessTkn);
        histReq.send();
    }
    
    uberGetAccessToken(self, code) {
        var accessTokenReq = new XMLHttpRequest();
        accessTokenReq.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Typical action to be performed when the document is ready:
                var responseObj = JSON.parse(accessTokenReq.responseText);
                var accessToken = responseObj["access_token"];
                console.log("accessToken: " + accessToken);

                ///get user profile
                self.uberGetUser(self, accessToken);

                ///get ride history
                self.uberGetRideHistory(self, accessToken);
            }
        };
        accessTokenReq.open('POST', 'https://login.uber.com/oauth/v2/token?client_secret=HX56llaT3Uhnp8VqOOX11G72gx5OIj8JZ7tmwLEN&client_id=KUMJcY1CaNaGzgbfMUTQwfTbb9Jevcbq&grant_type=authorization_code&redirect_uri=http://localhost/callback&scope=history&code='+code);
        accessTokenReq.send();
    }

    public uberAuthenticate(self): Promise<any> {
        return new Promise(function(resolve, reject) {
            var browserRef = window.cordova.InAppBrowser.open("https://login.uber.com/oauth/v2/authorize?" +
                "response_type=code&client_id=KUMJcY1CaNaGzgbfMUTQwfTbb9Jevcbq" +
                "&scope=profile history&redirect_uri=http://localhost/callback");

            browserRef.addEventListener("loadstart", (event) => {
                console.log("event.url: " + event.url);
                if ((event.url).indexOf("http://localhost/callback") === 0) {
                    browserRef.removeEventListener("exit", (event) => {});
                    browserRef.close();
                    var response = (event.url).split("?")[1];
                    var parsedResponse = {};
                    console.log(response.split("=")[0] + ": " + response.split("=")[1]);
                    parsedResponse[response.split("=")[0]] = response.split("=")[1];
                    let code = parsedResponse["code"];
                    
                    if (code !== undefined && code !== null) {  
                        ///GET Access Token
                        
                        self.uberGetAccessToken(self, code);
                        
                        resolve(parsedResponse);                        
                    } else {
                        reject("Problem authenticating with Uber");
                    }
                }
            });
            browserRef.addEventListener("exit", function(event) {
                reject("The Uber sign in flow was canceled");
            });
        });
    }

}
