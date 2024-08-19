import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {Exam, ExamDataPage} from '../entities/exam';
import {ResourceLink} from '../shared/resource-link';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ExamDataPage>{
    const url = pageRequest.getPageRequestURL('exams');
    const examDataPage = await this.http.get<ExamDataPage>(ApiManager.getURL(url)).toPromise();
    examDataPage.content = examDataPage.content.map((exam) => Object.assign(new Exam(), exam));
    return examDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ExamDataPage>{
    const url = pageRequest.getPageRequestURL('exams/basic');
    const examDataPage = await this.http.get<ExamDataPage>(ApiManager.getURL(url)).toPromise();
    examDataPage.content = examDataPage.content.map((exam) => Object.assign(new Exam(), exam));
    return examDataPage;
  }

  async get(id: number): Promise<Exam>{
    const exam: Exam = await this.http.get<Exam>(ApiManager.getURL(`exams/${id}`)).toPromise();
    return Object.assign(new Exam(), exam);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`exams/${id}`)).toPromise();
  }

  async add(exam: Exam): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`exams`), exam).toPromise();
  }

  async update(id: number, exam: Exam): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`exams/${id}`), exam).toPromise();
  }

}
