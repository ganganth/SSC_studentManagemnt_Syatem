import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Studentstatus} from '../entities/studentstatus';

@Injectable({
  providedIn: 'root'
})
export class StudentstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Studentstatus[]>{
    const studentstatuses = await this.http.get<Studentstatus[]>(ApiManager.getURL('studentstatuses')).toPromise();
    return studentstatuses.map((studentstatus) => Object.assign(new Studentstatus(), studentstatus));
  }

}
