import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Enrollmentstatus} from '../entities/enrollmentstatus';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Enrollmentstatus[]>{
    const enrollmentstatuses = await this.http.get<Enrollmentstatus[]>(ApiManager.getURL('enrollmentstatuses')).toPromise();
    return enrollmentstatuses.map((enrollmentstatus) => Object.assign(new Enrollmentstatus(), enrollmentstatus));
  }

}
