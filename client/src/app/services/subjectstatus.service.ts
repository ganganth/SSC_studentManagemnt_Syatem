import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Subjectstatus} from '../entities/subjectstatus';

@Injectable({
  providedIn: 'root'
})
export class SubjectstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Subjectstatus[]>{
    const subjectstatuses = await this.http.get<Subjectstatus[]>(ApiManager.getURL('subjectstatuses')).toPromise();
    return subjectstatuses.map((subjectstatus) => Object.assign(new Subjectstatus(), subjectstatus));
  }

}
