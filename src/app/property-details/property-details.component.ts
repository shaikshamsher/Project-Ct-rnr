import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { IMyDpOptions, IMyDateModel } from 'angular4-datepicker/src/my-date-picker';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Pipe({ name: 'newline' })
export class NewlinePipe implements PipeTransform {
  transform(value: string, args: string[]): any {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
}
@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css'],
  providers: [DatePipe]
})
export class PropertyDetailsComponent implements OnInit {
  private isEnquiry : boolean = false;
  private listingId: any;
  private propertyListingTimeSlotsUrl = 'http://www.api.propertyin.co.za/api/PropertyListing/GetListingTimeSlots';
  private propertyListingDetailsUrl = 'http://www.api.propertyin.co.za/api/PropertyListing/GetPropertyDetails';
  private listingCountUri = 'http://www.api.propertyin.co.za/api/PropertyListing/PostListingCount';
  private postContactDetailsUrl = 'http://www.api.propertyin.co.za/api/PropertyListing/PostContactDetails';
  lat = 51.678418;
  lng = 7.809007;
  private availableDates: any[] = [];
  private selectedDateSlots: any[] = [];
  private isFormVisible = false;
  private isShowCalenderLink = false;
  private isSlotsAvailable = true;
  private showPassport = false;
  private isSendEnquiryData = true;
  private isBookViewData = true;
  private isBookViewSelected = false;
  private selectedMaxValue: any;
  private selectedMinValue: any;
  private isBookAppointmentClicked: boolean = false;
  Salutations: string[] = ['Mr.', 'Mrs.', 'Ms.'];
  default: string = 'Salutation';
  IDProof: string[] = ['ID Proof', 'SAID', 'PassportNumber'];
  defaultIDProof: string = 'ID Proof';
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-MM-dd',
    inline: true,
    sunHighlight: false,
    highlightDates: this.availableDates
  };
  constructor(private service: AppService, private toastr: ToastrService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) {
    this.listingId = route.snapshot.queryParams['listingID'];
    this.selectedMaxValue = route.snapshot.queryParams['maxValue'];
    this.selectedMinValue = route.snapshot.queryParams['minValue'];
    this.createForm();
    this.formGroup.controls['idProofs'].setValue(this.defaultIDProof, { onlySelf: true });

    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    const listingCountObj = {
      'website': 'www.rentandrent.co.za',
      'recid': this.listingId,
      'listviewdate': currentDate,
      'view': '1'
    };
    this.service.postContactDetails(this.listingCountUri, listingCountObj)
      .subscribe(data => {
        const response = data;
      });
  }
  private formGroup: FormGroup;
  private mediaImages: any[];
  private propertyDetails: any;
  private timeSlots: any[] = [];
  private primaryContactDetails = {};
  private isTimeSlotsAvailable = false;
  private selectedDate: any;
  private selectedStartTime: any;
  private selectedEndTime: any;
  private propertyDetailsList: any;
  private isFormSubmitted = false;
  private isErrorMessage = 'Please enter required/valid field or fields.';
  emailPattern = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
  ngOnInit() {
    this.service.getPropertyListingsDetails(this.propertyListingDetailsUrl + '?listingId=' + this.listingId)
      .subscribe(dataListingsDetails => {
        this.mediaImages = [];
        dataListingsDetails.ListingPrice = this.getDefaultPriceFormat('R' + ' ' + dataListingsDetails.ListingPrice);
        dataListingsDetails.Levies = this.getDefaultPriceFormat('R' + ' ' + dataListingsDetails.Levies);
        dataListingsDetails.Rates = this.getDefaultPriceFormat('R' + ' ' + dataListingsDetails.Rates);
        this.propertyDetails = dataListingsDetails;
        this.propertyDetailsList = dataListingsDetails;
        this.mediaImages = dataListingsDetails.MediaImages;
        this.primaryContactDetails = dataListingsDetails.PrimaryContactDetails;
        const timeSlotsAvailable = dataListingsDetails.Availableslots;

        if (timeSlotsAvailable.length > 0) {
          for (let i = 0; i < timeSlotsAvailable.length; i++) {
            for (let j = 0; j < timeSlotsAvailable[i].timeslots.length; j++) {
              this.timeSlots.push({
                starttime: timeSlotsAvailable[i].timeslots[j].starttime.split(':')[0] + ':' + timeSlotsAvailable[i].timeslots[j].starttime.split(':')[1],
                endtime: timeSlotsAvailable[i].timeslots[j].endtime.split(':')[0] + ':' + timeSlotsAvailable[i].timeslots[j].endtime.split(':')[1],
                date: timeSlotsAvailable[i].dateavailable ? timeSlotsAvailable[i].dateavailable : null
              });
            }
            this.availableDates.push({
              year: parseInt(this.datePipe.transform(timeSlotsAvailable[i].dateavailable, 'yyyy')),
              month: parseInt(this.datePipe.transform(timeSlotsAvailable[i].dateavailable, 'MM')),
              day: parseInt(this.datePipe.transform(timeSlotsAvailable[i].dateavailable, 'dd')),
            });
            //this.isSlotsAvailable = true;
            // this.isTimeSlotsAvailable = true;
          }
        }
        else {
          this.isBookViewData = false;
        }
      });

  }

  onDateChanged(event: IMyDateModel) {
    this.selectedDate = null;
    this.selectedStartTime = null;
    this.selectedEndTime = null;
    const dateSelected = this.datePipe.transform(event.jsdate, 'yyyy-MM-dd');
    this.selectedDateSlots = this.timeSlots.filter(x => x.date === dateSelected);
    if (this.selectedDateSlots.length > 0) {
      this.isSlotsAvailable = true;
      this.isTimeSlotsAvailable = true;
      this.isBookViewSelected = false;
    } else {
      if (this.isTimeSlotsAvailable) {
        this.isTimeSlotsAvailable = false;
      }
    }
    this.selectedDate = this.datePipe.transform(event.jsdate, 'dd/MM/yyyy');
    this.selectedStartTime = this.selectedDateSlots[0].starttime;
    this.selectedEndTime = this.selectedDateSlots[0].endtime;
  }

  radioChange(e: any, isFromEnquiry) {
    this.isFormVisible = true;
    this.isSlotsAvailable = false;
    this.isShowCalenderLink = true;
    this.isTimeSlotsAvailable = false;
    this.isSendEnquiryData = false;
    this.isBookViewData = false;
    this.isBookViewSelected = false;
    if (isFromEnquiry) {
      this.isEnquiry = true;
    }
    else {
      this.isEnquiry = false;
    }
  }
  showCalanderClick(e: any) {

    this.isFormVisible = false;
    this.isShowCalenderLink = false;
    this.isSlotsAvailable = true;
    this.isSendEnquiryData = true;
    if (this.timeSlots.length > 0)
      this.isBookViewData = true;
    this.isBookViewSelected = false;
    this.formGroup.reset();
    this.formGroup.controls['idProofs'].setValue(this.defaultIDProof, { onlySelf: true });
  }

  bookViewClick(e: any) {
    if (!this.isTimeSlotsAvailable) {
      this.isBookViewSelected = true;
    }
  }

  navigateToHomePage() {
    this.router.navigate(['home'], {
      queryParams: {
      },
      skipLocationChange: false
    });
  }
  // Validation for the contact form
  createForm() {
    this.formGroup = this.fb.group({
      salutation: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phonenumber: new FormControl('', [Validators.required, Validators.minLength(9)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      SAID: new FormControl(''),
      passPort: new FormControl(''),
      description: new FormControl(''),
      selecteddate: new FormControl(''),
      starttime: new FormControl(''),
      endtime: new FormControl(''),
      listingid: new FormControl(''),
      mbtid: new FormControl(''),
      source: new FormControl(''),
      recordtype: new FormControl(''),
      propertytype: new FormControl(''),
      suburb: new FormControl(''),
      beds: new FormControl(''),
      baths: new FormControl(''),
      minval: new FormControl(''),
      maxval: new FormControl(''),
      idProofs: new FormControl('')
    });
  }

  // Check validation method
  validateForm() {

    let bodyDetails = {};
    let suburbsListSelected: string = "";
    let propertyTypesSelected: string = "";
    if (!this.formGroup.valid) {
      this.formGroup.get('lastname').markAsTouched();
      this.formGroup.get('firstname').markAsTouched();
      this.formGroup.get('email').markAsTouched();
      this.formGroup.get('phonenumber').markAsTouched();
      this.formGroup.get('salutation').markAsTouched();
      return this.toastr.error(this.isErrorMessage);
    } else {
      this.isBookAppointmentClicked = true;
      const filteredDataDetails = JSON.parse(localStorage.getItem('searchFiltersDetails'));
      if (JSON.parse(localStorage.getItem('searchFiltersDetails')) && JSON.parse(localStorage.getItem('searchFiltersDetails')).suburbsList != undefined && JSON.parse(localStorage.getItem('searchFiltersDetails')).suburbsList.length > 0) {
        if (filteredDataDetails.suburbsList.length > 1) {
          for (let i = 0; i < filteredDataDetails.suburbsList.length; i++) {
            if (filteredDataDetails.suburbsList.length === i + 1)
              suburbsListSelected += filteredDataDetails.suburbsList[i].Suburb.trim();
            else
              suburbsListSelected += filteredDataDetails.suburbsList[i].Suburb.trim() + ",";
          }
        }
        else {
          suburbsListSelected = filteredDataDetails.suburbsList[0].Suburb.trim();
        }
        if (filteredDataDetails.propertyTypesData.length > 1) {
          for (let i = 0; i < filteredDataDetails.propertyTypesData.length; i++) {
            if (filteredDataDetails.propertyTypesData.length === i + 1)
              propertyTypesSelected += filteredDataDetails.propertyTypesData[i].name.trim();
            else
              propertyTypesSelected += filteredDataDetails.propertyTypesData[i].name.trim() + ",";
          }
        }
        else if (filteredDataDetails.propertyTypesData.length == 1) {
          propertyTypesSelected = filteredDataDetails.propertyTypesData[0].name.trim();
        }
        else
          propertyTypesSelected = "House,Apartment/Flat,Commercial Property,Industrial Property,Vacant land/plot,Farm,Townhouse,BB";
      }
      else {
        suburbsListSelected = this.propertyDetails.Suburb;
        propertyTypesSelected = "House,Apartment/Flat,Commercial Property,Industrial Property,Vacant land/plot,Farm,Townhouse,BB";
      }
      this.selectedStartTime = this.isEnquiry ? null : this.selectedStartTime;
      this.selectedEndTime = this.isEnquiry ? null : this.selectedEndTime;
      this.formGroup.value.phonenumber = "27" + this.formGroup.value.phonenumber;
      this.formGroup.value.firstname = this.formGroup.value.firstname ? this.formGroup.value.firstname : "null";
      this.formGroup.value.selecteddate = this.selectedStartTime ? this.selectedDate : "null";
      this.formGroup.value.starttime = this.selectedStartTime ? this.selectedStartTime + ":00.000Z" : "null";
      this.formGroup.value.endtime = this.selectedEndTime ? this.selectedEndTime + ":00.000Z" : "null";
      this.formGroup.value.listingid = this.propertyDetailsList.ListingId;
      this.formGroup.value.mbtid = this.propertyDetailsList.MBTPropertyId;
      this.formGroup.value.source = "www.rentandrent.co.za";
      this.formGroup.value.recordtype = this.propertyDetailsList.ListingType;
      this.formGroup.value.propertytype = propertyTypesSelected;
      this.formGroup.value.suburb = suburbsListSelected;
      this.formGroup.value.beds = (filteredDataDetails && filteredDataDetails.bedsSelected != undefined) ? filteredDataDetails.bedsSelected.toString() : 0;
      this.formGroup.value.baths = (filteredDataDetails && filteredDataDetails.bathsSelected != undefined) ? filteredDataDetails.bathsSelected.toString() : 0;
      this.formGroup.value.minval = (filteredDataDetails && filteredDataDetails.minSelected != undefined) ? filteredDataDetails.minSelected.toString() : 1000;
      this.formGroup.value.maxval = (filteredDataDetails && filteredDataDetails.maxSelected != undefined) ? filteredDataDetails.maxSelected.toString() : 20000000;
      this.formGroup.value.SAID = (this.formGroup.value.SAID === null || this.formGroup.value.SAID === "") ? "null" : this.formGroup.value.SAID;
      this.formGroup.value.passPort = (this.formGroup.value.passPort === undefined || this.formGroup.value.passPort === null || this.formGroup.value.passPort === "") ? 'null' : this.formGroup.value.passPort;
      this.formGroup.value.description = (this.formGroup.value.description === null || this.formGroup.value.description === '') ? 'null' : this.formGroup.value.description;
      this.formGroup.value.salutation = this.formGroup.value.salutation === "Salutation" ? "null" : this.formGroup.value.salutation;
      delete this.formGroup.value.idProofs;
      this.service.postContactDetails(this.postContactDetailsUrl, this.formGroup.value)
        .subscribe(data => {
          const response = data;
          this.formGroup.reset();
          this.isFormSubmitted = true;
          this.showSAID = false;
          this.showPassport = false;
          this.toastr.success('Appointment booked successfully.');
          this.createForm();
          this.formGroup.controls['salutation'].setValue(this.default, { onlySelf: true });
          this.formGroup.controls['idProofs'].setValue(this.defaultIDProof, { onlySelf: true });
          this.isBookAppointmentClicked = false;
        });
    }
  }

  getDefaultPriceFormat(data: string) {
    let price = [];
    let finalPrice: string = '';
    if (data.length > 0) {
      for (let i = data.length; i > 0; i--) {
        price.push(data.substring(i - 3, i));
        data = data.substring(0, i - 3);
        i = i - 2;
      }
      price = price.reverse();
      for (let i = 0; i < price.length; i++) {
        finalPrice += price[i] + ' ';
      }
      return finalPrice;
    }
  }
  private showSAID = false;
  idproofchange(e: any) {
    if (this.formGroup.value.idProofs === 'SAID') {
      this.showSAID = true;
      this.showPassport = false;
    } else if (this.formGroup.value.idProofs === 'Passport Number' || this.formGroup.value.idProofs === 'PassportNumber') {
      this.showPassport = true;
      this.showSAID = false;
    }
  }
}
