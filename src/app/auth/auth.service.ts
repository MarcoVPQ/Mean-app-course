import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + '/user'

@Injectable({
    providedIn:"root"
})
export class AuthService {

 private token: string
 authenticatedUser:boolean = false
 private authStateListener = new Subject<boolean>()
 private authTimer : any
 private userId: string

    
 constructor(private http: HttpClient, private router: Router){}

 createUser(email: string, password: string){
    const user: AuthData = {email, password}
     this.http
    .post(`${BACKEND_URL}/signup`, user)
    .subscribe(response => {
        this.router.navigate['/']
        //console.log(response);
    }, error => {
        this.authStateListener.next(false)
    })
 }

 login( email: string, password: string){
     const user: AuthData = { email, password }
     this.http
     .post<{token: string, expiresIn: number, userId: string}>(
         `${BACKEND_URL}/login`, 
         user
    )
     .subscribe( response => {
        // console.log(response)
         const token = response.token
         this.token = token
         if(token){
            const expiresIn = response.expiresIn
            this.setAuthTimer(expiresIn)
            this.authenticatedUser = true
            this.userId = response.userId
            this.authStateListener.next(true)
            const now = new Date()
            const expirationDate = new Date( now.getTime() + expiresIn * 1000)
            this.saveAuthDate(token, expirationDate, this.userId)
            console.log(expirationDate)
            this.router.navigate(['/'])
         }
     }, error => this.authStateListener.next(false) )
 }

 logout(){
     this.token = null;
     this.authenticatedUser = false
     this.authStateListener.next(false)
     clearTimeout(this.authTimer)
     this.clearAuthData()
     this.userId = null
     this.router.navigate(['/'])
 }

 private saveAuthDate(token: string, expirationDate: Date, userId: string){
     localStorage.setItem('token', token)
     localStorage.setItem('expiresIn', expirationDate.toISOString())
     localStorage.setItem('userId', userId)
 }

 private clearAuthData(){
     localStorage.removeItem("token")
     localStorage.removeItem('expiresIn')
     localStorage.removeItem('userId')
 }

 private setAuthTimer(duration: number){
    //// console.log('Setting timer:' + duration)
    this.authTimer = setTimeout(() => {
        this.logout()
    }, duration * 1000)
 }
  autoAuthUser(){
     const authInfo = this.getAuthData()
     if(!authInfo){
         return
     }
     const now = new Date()
     const newExpiresIn = authInfo.expiresIn.getTime() - now.getTime()
     //console.log(authInfo, newExpiresIn)

     if(newExpiresIn > 0){
         this.token = authInfo.token;
         this.authenticatedUser = true
         this.userId = authInfo.userId
         this.setAuthTimer(newExpiresIn / 1000)
         this.authStateListener.next(true)
     }
  }

  getToken(){
    return this.token 
 }

  getAuthStatusListener(){
     return this.authStateListener.asObservable()
 }

  getIsAuth(){
    return this.authenticatedUser
 }

  getAuthData(){
     const token = localStorage.getItem('token')
     const expiresIn = localStorage.getItem('expiresIn')
     const userId = localStorage.getItem('userId')
     if(!token || !expiresIn){
         return
     }

     return { token, expiresIn: new Date(expiresIn), userId }
  }

 getUserId(){
     return this.userId
 }
}