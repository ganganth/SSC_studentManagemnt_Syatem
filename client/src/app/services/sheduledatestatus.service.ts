import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Sheduledatestatus} from '../entities/sheduledatestatus';

@Injectable({
  providedIn: 'root'
})
export class SheduledatestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Sheduledatestatus[]>{
    const sheduledatestatuses = await this.http.get<Sheduledatestatus[]>(ApiManager.getURL('sheduledatestatuses')).toPromise();
    return sheduledatestatuses.map((sheduledatestatus) => Object.assign(new Sheduledatestatus(), sheduledatestatus));
  }

}
