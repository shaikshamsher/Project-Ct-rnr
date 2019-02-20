import { Component,OnInit, Inject, HostListener } from '@angular/core';
import {FormControl} from '@angular/forms';
import {AppService} from './app.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { IMultiSelectOption, IMultiSelectSettings,IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { DOCUMENT } from "@angular/platform-browser";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})
  export class AppComponent {
    private listingsData:any;
    private propertySearchData:any;

    navIsFixed: boolean;
    constructor(@Inject(DOCUMENT) private document: Document) { }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
            this.navIsFixed = true;
        } else if (this.navIsFixed && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) { this.navIsFixed = false; } } scrollToTop() { (function smoothscroll() { var currentScroll = document.documentElement.scrollTop || document.body.scrollTop; if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - (currentScroll / 2));
            }
        })();
    }
}
