import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Country } from '../country.model';
import firebase from 'firebase/app'
import {AngularFireAuth} from '@angular/fire/auth'
import { User } from 'src/user.model';
import {AngularFirestore} from '@angular/fire/firestore';
import { News } from '../news.module';
//import { loadavg } from 'os';

@Injectable({
  providedIn: 'root'
})
export class CoronaService {

  public country: Country;
  private user : User;

  constructor(private http: HttpClient, private router: Router,
    private afAuth : AngularFireAuth, private firestore: AngularFirestore) { }

  getSummary(): Observable<any>{
    const url = "https://api.covid19api.com/summary"
    return this.http.get<any>(url)
  }

  getSevenDaysdata(): Observable<any>{
    var currentDate  = new Date()
    var pastDate  = new Date(currentDate)
    pastDate.setDate(pastDate.getDate()-7)
    var pipe = new DatePipe('en-US')
    var to = pipe.transform(currentDate, 'yyyy-MM-dd')
    var from = pipe.transform(pastDate, 'yyyy-MM-dd')
    const url = "https://api.covid19api.com/world"
    return this.http.get<any>(url)
  }
  getSevenDaysdatacountry(x : String): Observable<any>{
    var currentDate  = new Date()
    var pastDate  = new Date(currentDate)
    pastDate.setDate(pastDate.getDate()-7)
    var pipe = new DatePipe('en-US')
    var to = pipe.transform(currentDate, 'yyyy-MM-dd')
    var from = pipe.transform(pastDate, 'yyyy-MM-dd')
    const url = "https://api.covid19api.com/country/"+x
    // console.log(url)
    return this.http.get<any>(url)
  }
  getTotalDaysdata(): Observable<any>{
    var currentDate  = new Date()
    var pipe = new DatePipe('en-US')
    var to = pipe.transform(currentDate, 'yyyy-MM-dd')
    const url = "https://api.covid19api.com/world?from=2020-03-01T00:00:00Z&to=" + to +'T00:00:00Z'
    return this.http.get<any>(url)
  }
  // getTotalDaysdatacountry(): Observable<any>{
  //   var currentDate  = new Date()
  //   var pipe = new DatePipe('en-US')
  //   var to = pipe.transform(currentDate, 'yyyy-MM-dd')
  //   const url = "https://api.covid19api.com/country/south-africa?from=2020-03-01T00:00:00Z&to=" + to +'T00:00:00Z'
  //   return this.http.get<any>(url)
  // }

  clickonCountry(x: string){
    this.country = {
      name : x,
      date : new Date()
    };
    // this.firestore.collection('country').add(this.country);
    // console.log(x)
    this.router.navigate(["country/"+x]);
  }
  clickonWorldwide(){
    this.router.navigate(["worldwide"])
  }
  clickonnews(){
    this.router.navigate(["news"])
  }

  getCountry(){
    return this.country;
  }

  async signInWithGoogle(){
    const credientals = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    this.user = {
      uid: credientals.user.uid,
      displayName: credientals.user.displayName,
      email: credientals.user.email,
    };
    // we can choose specific users to sign in, by checking credientals.user.displayName
    // if it's a trusted user we do this : 
    if (this.user.displayName != "malicious"){
      localStorage.setItem("user", JSON.stringify(this.user));
      this.updateUserData();
      this.router.navigate(["signin"]);
    // else we do this.router.navigate(["home"]);
    } else {
      this.signOut();
      this.router.navigate(["home"]);
    }
  }
  private updateUserData()
  {
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email,
    }, {merge: true });
  }
  getUser(){
    if(this.user== null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    return this.user;
  }

  userSignedIn() : boolean {
    return JSON.parse(localStorage.getItem("user")) != null;
  }
  signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.router.navigate(["worldwide"]);
  }

  getNews(){
    return this.firestore.collection("users")
    .doc(this.user.uid).collection("news").valueChanges();
  }

  getallNews(){
    var list2 =[];
    var n=0;
    var list1=[];
    this.firestore.collection("users").valueChanges().subscribe((snapshot=>{
      n = snapshot.length;
      for (let i = 0; i < snapshot.length; i++) {      
        this.firestore.collection("users")
        .doc(snapshot[i]['uid']).collection("news").valueChanges().subscribe((news : News[])=>{
          for (let i = 0; i < news.length; i++) {   
            list2.push(news[i])
        }
        });
      };
      
    }));

    return(list2);
  }

  addnews(news: News) {
    this.firestore.collection('users').doc(this.user.uid)
    .collection("news").add(news);
  }
  
}