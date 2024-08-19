import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Gradeyearstatus} from '../entities/gradeyearstatus';

@Injectable({
  providedIn: 'root'
})
export class GradeyearstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Gradeyearstatus[]>{
    const gradeyearstatuses = await this.http.get<Gradeyearstatus[]>(ApiManager.getURL('gradeyearstatuses')).toPromise();
    return gradeyearstatuses.map((gradeyearstatus) => Object.assign(new Gradeyearstatus(), gradeyearstatus));
  }

}
