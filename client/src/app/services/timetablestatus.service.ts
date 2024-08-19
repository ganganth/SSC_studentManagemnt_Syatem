import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Timetablestatus} from '../entities/timetablestatus';

@Injectable({
  providedIn: 'root'
})
export class TimetablestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Timetablestatus[]>{
    const timetablestatuses = await this.http.get<Timetablestatus[]>(ApiManager.getURL('timetablestatuses')).toPromise();
    return timetablestatuses.map((timetablestatus) => Object.assign(new Timetablestatus(), timetablestatus));
  }

}
