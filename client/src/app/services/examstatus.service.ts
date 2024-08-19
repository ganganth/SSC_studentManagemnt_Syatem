import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Examstatus} from '../entities/examstatus';

@Injectable({
  providedIn: 'root'
})
export class ExamstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Examstatus[]>{
    const examstatuses = await this.http.get<Examstatus[]>(ApiManager.getURL('examstatuses')).toPromise();
    return examstatuses.map((examstatus) => Object.assign(new Examstatus(), examstatus));
  }

}
