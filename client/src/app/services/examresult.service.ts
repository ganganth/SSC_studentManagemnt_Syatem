import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Examresult, ExamresultDataPage} from '../entities/examresult';

@Injectable({
  providedIn: 'root'
})
export class ExamresultService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ExamresultDataPage>{
    const url = pageRequest.getPageRequestURL('examresults');
    const examresultDataPage = await this.http.get<ExamresultDataPage>(ApiManager.getURL(url)).toPromise();
    examresultDataPage.content = examresultDataPage.content.map((examresult) => Object.assign(new Examresult(), examresult));
    return examresultDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ExamresultDataPage>{
    const url = pageRequest.getPageRequestURL('examresults/basic');
    const examresultDataPage = await this.http.get<ExamresultDataPage>(ApiManager.getURL(url)).toPromise();
    examresultDataPage.content = examresultDataPage.content.map((examresult) => Object.assign(new Examresult(), examresult));
    return examresultDataPage;
  }

  async get(id: number): Promise<Examresult>{
    const examresult: Examresult = await this.http.get<Examresult>(ApiManager.getURL(`examresults/${id}`)).toPromise();
    return Object.assign(new Examresult(), examresult);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`examresults/${id}`)).toPromise();
  }

  async add(examresult: Examresult): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`examresults`), examresult).toPromise();
  }

  async update(id: number, examresult: Examresult): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`examresults/${id}`), examresult).toPromise();
  }

}
