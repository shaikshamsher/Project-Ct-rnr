import { Component, OnInit, AnimationTransitionEvent, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from '../app.service';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import 'rxjs/add/observable/of';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-property-search',
  templateUrl: './property-search.component.html',
  styleUrls: ['./property-search.component.css'],
  providers: [DatePipe]
})
export class PropertySearchComponent implements OnInit {
  state: string;

  private _showButton: boolean;
  get showButton() {
    return this._showButton;
  }
  set showButton(val: boolean) {
    if (val) {
      this.state = 'visible';
      this._showButton = true;
    } else {
      this.state = 'hidden';
    }
  }
  private selectedProvince = '';
  private isFromOrderBy = false;
  private isAsc = false;
  private isDesc = true;
  private isListingImg = false;
  private isRelatedCities = false;
  private isSearchDisabled = true;
  private isMultipleSuburbsSelected = false;
  private propertySearchData: any;
  private isSuburbSearchValid = false;
  private isSearchErrorMessage = 'Please enter atleast one suburb to search.';
  private searchFilterData: any = {};
  searchTerm: FormControl = new FormControl();
  filteredCountriesSingle: any[];
  searchResult = [];
  private propertyTypesData: any[];
  optionsModel = [];
  dropdownList = [];
  private myOptions: IMultiSelectOption[] = [];
  cities = [];
  dropdownSettings = {};
  country: any;
  private propertyTypeUrl = 'http://www.api.propertyin.co.za/api/Home/GetPropertyTypes';
  private propertyListingUrl = 'http://www.api.propertyin.co.za/api/PropertyListing/GetPropertyListings';
  private vendorDetailsUri = 'http://www.api.propertyin.co.za/api/PropertyListing/GetVendorDetails';
  private provinceListings = 'http://www.api.propertyin.co.za/api/Home/GetProvinceListings';
  suburbs: any[];
  filteredCountriesMultiple: any[];
  private optionsData: any[];
  private isSuburbWithSingleRecord = false;
  private selectedMaxPrice: any = 20000000;
  private selectedMinPrice: any = 1000;
  private selectedBeds: any = "0";
  private selectedBaths: any = "0";
  private selectedSuburbsList: string;
  private relatedCities: any[] = [];
  optionSelected: any;
  private filteredData: any;
  private suburbName: string;
  private listingImage: string;
  // private isSuburbsDataLoaded = false;
  private priceMinValue = new FormControl();
  private priceMaxValue = new FormControl();
  private setBathCount = new FormControl();
  private setBedsCount = new FormControl();
  private selectedRecordType = 'ToRent';
  bedsData: string[] = ['0+', '1+', '2+', '3+', '4+', '5+'];
  priceData: string[] = ['R 1 000', 'R 3 000', 'R 5 000', 'R 8 000', 'R 10 000', 'R 15 000', 'R 20 000', 'R 25 000+'];
  setNewForm = new FormGroup({
    priceMinState: this.priceMinValue,
    priceMaxState: this.priceMaxValue,
    setBathValue: this.setBathCount,
    setBedsValue: this.setBedsCount
  });
  private isNavFromDetails: string;
  @ViewChild('bedsElement') bedsInput;
  @ViewChild('bathsElement') bathInput;
  @ViewChild('priceElement') priceElement;

  constructor(private service: AppService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) {
    this.isNavFromDetails = this.route.snapshot.queryParams['fromHome'];
    if (this.isNavFromDetails === 'true') {
      this.filteredData = JSON.parse(localStorage.getItem('filteredData'));
    } else {
      this.service.getCountries().subscribe(data => {
        this.filteredData = data;
        localStorage.setItem('filteredData', JSON.stringify(this.filteredData));
      });
    }
  }

  filterCountryMultiple(event) {
    let query = event.query;
    this.filteredCountriesMultiple = this.filterCountry(query, this.filteredData, false);
  }

  filterCountry(query, countries: any[], isFromCitySearch): any[] {
    let filtered: any[] = [];
    if (countries.length > 0) {
      for (let i = 0; i < countries.length; i++) {
        let country = countries[i];
        if (isFromCitySearch) {
          if ((country.City.toLowerCase().indexOf(query.toLowerCase()) === 0)) {
            filtered.push(country);
            this.isSearchDisabled = false;
          }
        }
        else {
          if ((country.Suburb.toLowerCase().indexOf(query.toLowerCase()) === 0)) {
            filtered.push(country);
            this.isSearchDisabled = false;
          }
        }
      }
    }
    return filtered;
  }
  private mySettings: IMultiSelectSettings = {
    selectionLimit: 0,
    closeOnSelect: false,
    dynamicTitleMaxItems: 2,
    checkedStyle: 'fontawesome'
  };

  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };

  ngOnInit() {
    this.service.getPropertyTypes(this.propertyTypeUrl).subscribe(dataTypes => {
      let idval = 0;
      this.propertyTypesData = dataTypes;
      for (let i = 0; i < this.propertyTypesData.length; i++) {
        let typeName = this.propertyTypesData[i];
        idval = i + 1;
        this.myOptions.push({ id: idval, name: typeName.propertyType });
      }
      this.optionsData = JSON.parse(JSON.stringify(this.myOptions));
    });


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      placeholder: 'Property Type',
      class: 'countnumber'
    };

    this.showButton = false;
  }

  animationDone(event: AnimationTransitionEvent) {
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      this._showButton = false;
    }
  }

  onOptionsSelected($event) {
  }

  btnListingSearch() {
    this.isFromOrderBy = false;
    this.isDesc = true;
    this.isAsc = false;
    this.selectedProvince = '';
    this.searchFilterData = {};
    if (this.suburbs.length === 0) {
      this.relatedCities = [];
      this.propertySearchData.listings = null;
      this.isRelatedCities = false;
      this.isSuburbSearchValid = true;
      if (this.isSuburbSearchValid) {
        this.toastr.error(this.isSearchErrorMessage);
        return true;
      }
      return false;
    }
    if (this.suburbs.length === 1) {
      if (this.selectedRecordType === "Attorney" || this.selectedRecordType === 'Plumber' || this.selectedRecordType === 'Photographer') {
        this.getIndividualsDetails();
      } else {
        this.isSuburbWithSingleRecord = true;
        this.isMultipleSuburbsSelected = false;
        this.suburbName = this.suburbs[0].Suburb;
        this.isSuburbSearchValid = false;
        this.getSearchedPropertyListing(true, null);
      }
    } else if (this.suburbs.length > 1) {
      if (this.selectedRecordType === 'Attorney' || this.selectedRecordType === 'Plumber' || this.selectedRecordType === 'Photographer') {
        this.getIndividualsDetails();
      } else {
        this.isRelatedCities = false;
        this.isSuburbWithSingleRecord = false;
        this.isMultipleSuburbsSelected = true;
        this.isSuburbSearchValid = false;
        this.getSearchedPropertyListing(true, null);
      }
    }

  }
  private vendorDetails: any;
  getIndividualsDetails() {
    this.propertySearchData = [];
    this.vendorDetails = [];
    this.selectedSuburbsList = '';
    this.selectedSuburbsList = 'https://listurproperty.secure.force.com/services/apexrest/Vendor/recordtype=' + this.selectedRecordType;
    let selectedSuburbs = this.suburbs;
    if (selectedSuburbs.length === 0) {
      this.toastr.error(this.isSearchErrorMessage);
      return false;
    }
    this.suburbName = "";
    for (let i = 0; i < selectedSuburbs.length; i++) {
      let suburbName = selectedSuburbs[i].Suburb;
      this.selectedSuburbsList += '&suburb=' + suburbName.trim();
      if (selectedSuburbs.length === i + 1)
        this.suburbName += selectedSuburbs[i].Suburb.trim();
      else
        this.suburbName += selectedSuburbs[i].Suburb.trim() + ",";
    }
    this.isRelatedCities = false;
    this.service.getPropertyListings(this.vendorDetailsUri, this.selectedSuburbsList).subscribe(dataListings => {
      this.vendorDetails = dataListings;
    });
  }
  onCityClick(city) {
    this.selectedProvince = '';
    let suburbsList = this.filterCountry(city.trim(), this.filteredData, true);
    this.suburbs = [];
    this.suburbs.push(suburbsList[0]);
    this.getSearchedPropertyListing(false, city.trim());
  }
  getSearchedPropertyListing(isFromMainSearch, city) {
    // this.selectedMaxPrice = 20000000;
    // this.selectedMinPrice = 1000;
    // this.selectedBeds = '0';
    // this.selectedBaths = '0';
    this.propertySearchData = [];
    this.listingImage = null;
    this.relatedCities = [];
    const selectedSuburbs = this.suburbs;
    if (selectedSuburbs.length === 0) {
      this.toastr.error(this.isSearchErrorMessage);
      return false;
    }
    let selectedPropertyType = this.optionsModel;
    this.selectedSuburbsList = '';
    if (!this.isFromOrderBy) {
      if (isFromMainSearch) {
      this.selectedSuburbsList = "https://listurproperty.secure.force.com/services/apexrest/Search/recordtype=" + this.selectedRecordType;
      } else {
      this.selectedSuburbsList = "https://listurproperty.secure.force.com/services/apexrest/Searchcity/recordtype=" + this.selectedRecordType;
      }
      } else {
      this.selectedSuburbsList = "https://listurproperty.secure.force.com/services/apexrest/Searchsorting/recordtype=" + this.selectedRecordType;
      }
      if (isFromMainSearch || this.isFromOrderBy) {
      for (let i = 0; i < selectedSuburbs.length; i++) {
      let suburbName = selectedSuburbs[i].Suburb;
      this.selectedSuburbsList += '&suburb=' + suburbName.trim();
      }
      }
      else {
      this.selectedSuburbsList += "&suburb=" + city.trim();
      this.suburbName = city;
      }
    this.searchFilterData.suburbsList = selectedSuburbs;
    if (selectedSuburbs.length == 1) {
      let cities = this.filteredData.filter(x => x.Suburb === selectedSuburbs[0].Suburb)[0].RelatedCities.split(',');
      for (let i = 0; i < cities.length; i++) {
        this.relatedCities.push(cities[i]);
      }
      this.isRelatedCities = true;
      this.isMultipleSuburbsSelected = false;
    }
    else if (selectedSuburbs.length > 1) {
      this.isMultipleSuburbsSelected = true;
    }
    this.isProvinceRelatedCities = false;
    if (selectedPropertyType.length > 0 && selectedPropertyType.length != this.propertyTypesData.length) {
      for (let i = 0; i < selectedPropertyType.length; i++) {
        const typeName = selectedPropertyType[i].name;
        this.selectedSuburbsList += "&propertytype=" + typeName.trim();
      }
    } else {
      // this.selectedSuburbsList += "&propertytype=SelectAll";
    }

    this.searchFilterData.propertyTypesData = selectedPropertyType;
    // this.selectedMaxPrice = (this.selectedMaxPrice === "0") ? 20000000 : this.selectedMaxPrice;
    // this.selectedMinPrice = (this.selectedMinPrice === "0") ? 1000 : this.selectedMinPrice;
    this.selectedMaxPrice = (this.setNewForm.value.priceMaxState === null || this.setNewForm.value.priceMaxState === "0") ? 20000000 : this.setNewForm.value.priceMaxState;
    this.selectedMinPrice = (this.setNewForm.value.priceMinState === null || this.setNewForm.value.priceMinState === "0") ? 1000 : this.setNewForm.value.priceMinState;

    if (this.selectedMaxPrice && this.selectedMaxPrice != 20000000 && this.selectedMaxPrice.indexOf('R') > -1) {
      this.selectedMaxPrice = this.selectedMaxPrice.replace('R ', '');
      this.selectedMaxPrice = this.selectedMaxPrice.replace('+', '');
      this.selectedMaxPrice = this.selectedMaxPrice.trim();
      const MaxPrice = this.selectedMaxPrice.split(' ');
      if (MaxPrice.length === 3) {
        this.selectedMaxPrice = MaxPrice[0] + MaxPrice[1] != undefined ? MaxPrice[0] + MaxPrice[1] + MaxPrice[2] : null;
      } else if (MaxPrice.length === 2) {
        this.selectedMaxPrice = MaxPrice[0] + MaxPrice[1] != undefined ? MaxPrice[0] + MaxPrice[1] : null;
      }
    }
    if (this.selectedMinPrice && this.selectedMinPrice != 1000 && this.selectedMinPrice.indexOf('R') > -1) {
      this.selectedMinPrice = this.selectedMinPrice.replace('R ', '');
      this.selectedMinPrice = this.selectedMinPrice.replace('+', '');
      this.selectedMinPrice = this.selectedMinPrice.trim();
      const MinPrice = this.selectedMinPrice.split(' ');
      if (MinPrice.length === 3) {
        this.selectedMinPrice = MinPrice[0] + MinPrice[1] !== undefined ? MinPrice[0] + MinPrice[1] + MinPrice[2] : null;
      } else if (MinPrice.length === 2) {
        this.selectedMinPrice = MinPrice[0] + MinPrice[1] !== undefined ? MinPrice[0] + MinPrice[1] : null;
      }
    }
    // this.selectedBaths = (this.selectedBaths === "0") ? "0" : this.selectedBaths.replace('+', '');
    // this.selectedBeds = (this.selectedBeds === "0") ? "0" : this.selectedBeds.replace('+', '');
    this.selectedBaths = (this.setNewForm.value.setBathValue === null || this.setNewForm.value.setBathValue === '0') ? '0' : this.setNewForm.value.setBathValue;
    this.selectedBeds = (this.setNewForm.value.setBedsValue === null || this.setNewForm.value.setBedsValue === '0') ? '0' : this.setNewForm.value.setBedsValue;

    let parameters;
    this.selectedBeds = this.selectedBeds === '0' ? 0 : this.selectedBeds;
    this.selectedBaths = this.selectedBaths === '0' ? 0 : this.selectedBaths;
    // this.selectedBeds = this.selectedBeds === 'Any' ? 0 : this.selectedBeds;
    // this.selectedBaths = this.selectedBaths === 'Any' ? 0 : this.selectedBaths;

    if (!this.isFromOrderBy) {
      if (isFromMainSearch) {
      parameters = this.selectedSuburbsList + '&maxval=' + this.selectedMaxPrice + '&minval=' + this.selectedMinPrice + '&beds=' + this.selectedBeds + '&baths=' + this.selectedBaths;
      } else {
      parameters = this.selectedSuburbsList + '&maxval=' + this.selectedMaxPrice + '&minval=' + this.selectedMinPrice + '&beds=' + this.selectedBeds + '&baths=' + this.selectedBaths + '&city=' + city;
      }
      } else {
      parameters = this.selectedSuburbsList + '&maxval=' + this.selectedMaxPrice + '&minval=' + this.selectedMinPrice + '&beds=' + this.selectedBeds + '&baths=' + this.selectedBaths + '&orderby=DESC';
      }
    const Params = new URLSearchParams();

    this.searchFilterData.bedsSelected = this.selectedBeds;
    this.searchFilterData.bathsSelected = this.selectedBaths;
    this.searchFilterData.maxSelected = this.selectedMaxPrice;
    this.searchFilterData.minSelected = this.selectedMinPrice;
    this.service.getPropertyListings(this.propertyListingUrl, parameters).subscribe(dataListings => {
      this.propertySearchData = dataListings;
      this.propertySearchData.listings.forEach(element => {
        element.ListingPrice = this.getDefaultPriceFormat('R' + ' ' + element.ListingPrice);
      });
      this.isListingImg = dataListings.listings && dataListings.listings.length > 0 ? this.isListingImg = true : this.isListingImg = false;
      this.selectedBaths = (this.selectedBaths === '0' || this.selectedBaths === 0) ? '0' : this.selectedBaths;
      this.selectedBeds = (this.selectedBeds === '0' || this.selectedBeds === 0) ? '0' : this.selectedBeds;
      this.selectedMaxPrice = (this.selectedMaxPrice === '20000000' || this.selectedMaxPrice === 20000000) ? '20000000' : this.selectedMaxPrice;
      this.selectedMinPrice = (this.selectedMinPrice === '1000' || this.selectedMinPrice === 1000) ? '1000' : this.selectedMinPrice;
    }, err => {

      alert('error');
    });

  }
  onItemSelect(e: any) {
    this.isSearchDisabled = false;
  }

  // recordTypeClick(e: any) {
  //   for (let i = 0; i < e.srcElement.parentElement.parentElement.children.length; i++) {
  //     e.srcElement.parentElement.parentElement.children[i].className = '';
  //   }
  //   e.srcElement.parentElement.classList.add('active');
  //   if (e.srcElement.text === 'For Sale') {
  //     this.selectedRecordType = 'ToSale';
  //   } else {
  //     if (e.srcElement.text.indexOf(' ') > -1) {
  //       const RecordType = e.srcElement.text.split(' ');
  //       this.selectedRecordType = RecordType[0] + RecordType[1];
  //     } else {
  //       this.selectedRecordType = e.srcElement.text;
  //     }
  //   }
  //   this.suburbName = "";
  //   for (let i = 0; i < this.suburbs.length; i++) {
  //     if (this.suburbs.length === i + 1)
  //       this.suburbName += this.suburbs[i].Suburb.trim();
  //     else
  //       this.suburbName += this.suburbs[i].Suburb.trim() + ",";
  //   }
  //   if (this.suburbs.length > 1) {
  //     this.isSuburbWithSingleRecord = false;
  //     this.isMultipleSuburbsSelected = true;
  //   }
  //   else if (this.suburbs.length === 1) {
  //     this.isSuburbWithSingleRecord = true;
  //     this.isMultipleSuburbsSelected = false;
  //   }

  //   if (this.selectedRecordType != 'Attorney' && this.selectedRecordType != 'Plumber' && this.selectedRecordType != 'Photographer')
  //     this.getSearchedPropertyListing(true, null);
  //   else
  //     this.getIndividualsDetails();
  // }
  propertyDetailsClick(listingId, propertyReferencenumber) {
/*     const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    const listingCountObj = {
      'website': 'www.rentandrent.co.za',
      'recid': listingId,
      'listviewdate': currentDate,
      'view': '1'
    };
    this.service.postContactDetails(this.listingCountUri, listingCountObj)
      .subscribe(data => {
        const response = data;
      }); */

    localStorage.setItem('searchFiltersDetails', JSON.stringify(this.searchFilterData));
    this.router.navigate(['propertydetails'], {
      queryParams: {
        listingID: listingId,
        propertyReferenceNumber: propertyReferencenumber
      }
      , skipLocationChange: false
    });
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
  private isProvinceRelatedCities: boolean = false;
  btnProvince(selectedProvince) {
    this.isFromOrderBy = false;
    this.isDesc = true;
    this.isAsc = false;
    this.selectedProvince = '';
    this.setNewForm.patchValue({priceMinState : null, priceMaxState : null, setBathValue : 0, setBedsValue: 0});
    this.priceElement.reset();
    this.suburbs = [];
    this.optionsModel = [];
    this.relatedCities = [];
    this.propertySearchData = [];
    this.isSuburbWithSingleRecord = false;
    this.isMultipleSuburbsSelected = false;
    this.isRelatedCities = false;
    const provinceUri = 'https://listurproperty.secure.force.com/services/apexrest/Suburb/province=' + selectedProvince;
    this.service.getPropertyListings(this.provinceListings, provinceUri).subscribe(rentalCities => {
      let citiesData = rentalCities;
      for (let i = 0; i < rentalCities.length; i++) {
        this.relatedCities.push({ suburb: rentalCities[i].Suburb, count: rentalCities[i].Rentcount });
      }
      this.isRelatedCities = false;
      this.isProvinceRelatedCities = true;
    }, err => {
      alert('error');
    });


    // let uri = "https://listurproperty.secure.force.com/services/apexrest/Search/recordtype=" + this.selectedRecordType + "&province=" + selectedProvince;
    // this.service.getPropertyListings(serviceUrl, uri).subscribe(dataListings => {
    //   this.propertySearchData = dataListings;
    //   this.propertySearchData.listings.forEach(element => {
    //     element.ListingPrice = this.getDefaultPriceFormat('R' + ' ' + element.ListingPrice);
    //   });
    //   this.isListingImg = true;
    // }, err => {
    //   alert('error');
    // });
  }
  provinceCityClick(provinceCity) {
    this.selectedProvince = provinceCity;
    let uri = '';
    if (!this.isFromOrderBy) {
      uri = 'https://listurproperty.secure.force.com/services/apexrest/Search/recordtype=ToRent&suburb=' + provinceCity;
    } else {
      uri = 'https://listurproperty.secure.force.com/services/apexrest/Searchsorting/recordtype=ToRent&suburb=' + provinceCity +"&orderby=DESC";
    }
    this.service.getPropertyListings(this.propertyListingUrl, uri).subscribe(dataListings => {
      this.propertySearchData = dataListings;
      this.propertySearchData.listings.forEach(element => {
        element.ListingPrice = this.getDefaultPriceFormat('R' + ' ' + element.ListingPrice);
      });
      this.isListingImg = true;
    }, err => {
      alert('error');
    });
  }

  bedsOnChange(value) {
    this.selectedBeds = value.to_value;
  }

  bathOnChange(value) {
    this.selectedBaths = value.to_value;
  }
  minPriceOnChange(value) {
    this.setNewForm.patchValue({priceMinState : value.from_value, priceMaxState : value.to_value});
  }
  radioBathsChange(e: any) {
    this.selectedBaths = this.setNewForm.value.setBathValue;
  }
  radioBedsChange(e: any) {
    this.selectedBeds = this.setNewForm.value.setBedsValue;
  }
  btnAsc() {
    this.isFromOrderBy = false;
    this.isDesc = true;
    this.isAsc = false;
    if (this.selectedProvince !== '') {
      this.provinceCityClick(this.selectedProvince);
    } else {
      this.getSearchedPropertyListing(false, null);
    }
  }
  btnDesc() {
    this.isFromOrderBy = true;
    this.isDesc = false;
    this.isAsc = true;
    if (this.selectedProvince !== '') {
      this.provinceCityClick(this.selectedProvince);
    } else {
      this.getSearchedPropertyListing(false, null);
    }
  }
}
