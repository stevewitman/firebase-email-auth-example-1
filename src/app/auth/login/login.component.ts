import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authError: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.eventAuthError$.subscribe( data => {
      this.authError = data;
    });
  }

  login(frm) {
    console.log('Login component - login()')
    this.authService.login(frm.value.email, frm.value.password);
  }

}
