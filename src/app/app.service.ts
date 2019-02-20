import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams, RequestOptions,Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AppService {


    url: string;
    constructor(private http: Http) {
        this.url = 'http://www.api.propertyin.co.za/api/home/Index';
    }
    private getHeaders() {
        let headersinfo = new Headers({
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        return new RequestOptions({ headers: headersinfo });
    }
    getCountries(): Observable<any> {
        let headerOptions = this.getHeaders();
        return this.http.get(this.url)
            .map((response => response.json()));
    }
    getPropertyTypes(urltype): Observable<any> {
        let headerOptions = this.getHeaders();
        return this.http.get(urltype)
            .map((response => response.json()));
    }
    getPropertyListings(urlListings, url: string): Observable<any> {
        let headerOptions = this.getHeaders();
        return this.http.get(urlListings, {
            params: {
                url: url,
            }
        })
            .map((response => response.json()));
    }
    getPropertyListingsDetails(urlListingsDetails): Observable<any> {
        let headerOptions = this.getHeaders();
        return this.http.get(urlListingsDetails)
            .map((response => response.json()));
    }

    getPropertyListingsTimeSlots(urlListingsTimeSlots): Observable<any> {
        let headerOptions = this.getHeaders();
        return this.http.get(urlListingsTimeSlots)
            .map((response => response.json()));
    }
    
    postContactDetails(url,body): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(url,JSON.stringify(body), options)
      .map((response => response.json()));
    }
}
