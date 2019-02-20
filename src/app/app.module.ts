import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/primeng';
import { AppService } from './app.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { PropertySearchComponent } from './property-search/property-search.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TypeaheadModule } from 'ngx-bootstrap';
import { PropertyDetailsComponent, NewlinePipe } from './property-details/property-details.component';
import { MyDatePickerModule } from 'angular4-datepicker/src/my-date-picker/index';
import { AgmCoreModule } from '@agm/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { ContactUsComponent } from './shared/components/contact-us/contact-us.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: PropertySearchComponent },
  { path: 'propertysearch', component: PropertySearchComponent },
  { path: 'propertydetails', component: PropertyDetailsComponent },
  { path: 'contact-us', component: ContactUsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    PropertySearchComponent,
    PropertyDetailsComponent,
    NewlinePipe,
    ContactUsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    MultiselectDropdownModule,
    NgMultiSelectDropDownModule,
    RouterModule.forRoot(appRoutes),
    MyDatePickerModule,
    IonRangeSliderModule,
    AgmCoreModule.forRoot({
    }),
    TypeaheadModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [AppService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
 