import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form = this._fb.group({
    DNI: [''],
    NAME: [''],
    SURNAME: [''],
    SECOND_SURNAME: [''],
    EMAIL: ['']
  });

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
