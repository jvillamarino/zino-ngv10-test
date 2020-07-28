import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import swal from "sweetalert2";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = this._fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private route: Router
  ) {}

  ngOnInit(): void {}

  login(evt: Event) {
    const { user, password } = this.form.value;
    this._authService.validateUser(user, password).subscribe((res) => {
      res && this.route.navigateByUrl('/dashboard');
      !res && Swal.fire('Opps', 'Credenciales invalidas', 'error');
    });
  }
}
