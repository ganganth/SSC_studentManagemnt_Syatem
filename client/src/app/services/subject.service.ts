import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Subject, SubjectDataPage} from '../entities/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<SubjectDataPage>{
    const url = pageRequest.getPageRequestURL('subjects');
    const subjectDataPage = await this.http.get<SubjectDataPage>(ApiManager.getURL(url)).toPromise();
    subjectDataPage.content = subjectDataPage.content.map((subject) => Object.assign(new Subject(), subject));
    return subjectDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<SubjectDataPage>{
    const url = pageRequest.getPageRequestURL('subjects/basic');
    const subjectDataPage = await this.http.get<SubjectDataPage>(ApiManager.getURL(url)).toPromise();
    subjectDataPage.content = subjectDataPage.content.map((subject) => Object.assign(new Subject(), subject));
    return subjectDataPage;
  }

  async get(id: number): Promise<Subject>{
    const subject: Subject = await this.http.get<Subject>(ApiManager.getURL(`subjects/${id}`)).toPromise();
    return Object.assign(new Subject(), subject);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`subjects/${id}`)).toPromise();
  }

  async add(subject: Subject): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`subjects`), subject).toPromise();
  }

  async update(id: number, subject: Subject): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`subjects/${id}`), subject).toPromise();
  }

}
