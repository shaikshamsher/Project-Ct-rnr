import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
 successMessage = 'Form submitted success fully'
;  constructor(private toastr: ToastrService, public router: Router) { }

  ngOnInit() {
  }

/* 
  formSubmitted() {
    this.toastr.success(this.successMessage);
    this.router.navigate(['home']);
  } */


}
