import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private eventAuthError = new BehaviorSubject<string>('');
  eventAuthError$ = this.eventAuthError.asObservable();

  newUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {}

  getUserState() {
    return this.afAuth.authState;
  }

  createUser(user) {
    console.log('user: ', user);
    this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        this.newUser = user;
        console.log('userCredential: ', userCredential);
        userCredential.user.updateProfile({
          displayName: user.firstName + ' ' + user.lastName,
        });
        this.insertUserData(userCredential).then(() => {
          this.router.navigate(['/home']);
        });
      })
      .catch((error) => {
        this.eventAuthError.next(error);
      });
  }
  // use catch above ^ in case of weak password, email not valid, email already used

  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      role: 'author',
    });
  }

  login(email: string, password: string) {
    console.log('auth service - login()')
    this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        if (userCredential) {
          this.router.navigate(['/home']);
        }
      });
  }

  logout() {
    return this.afAuth.signOut();
  }
}
