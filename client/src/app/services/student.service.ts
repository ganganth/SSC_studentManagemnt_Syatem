import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Student, StudentDataPage} from '../entities/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<StudentDataPage>{
    const url = pageRequest.getPageRequestURL('students');
    const studentDataPage = await this.http.get<StudentDataPage>(ApiManager.getURL(url)).toPromise();
    studentDataPage.content = studentDataPage.content.map((student) => Object.assign(new Student(), student));
    return studentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<StudentDataPage>{
    const url = pageRequest.getPageRequestURL('students/basic');
    const studentDataPage = await this.http.get<StudentDataPage>(ApiManager.getURL(url)).toPromise();
    studentDataPage.content = studentDataPage.content.map((student) => Object.assign(new Student(), student));
    return studentDataPage;
  }

  async get(id: number): Promise<Student>{
    const student: Student = await this.http.get<Student>(ApiManager.getURL(`students/${id}`)).toPromise();
    return Object.assign(new Student(), student);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`students/${id}`)).toPromise();
  }

  async add(student: Student): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`students`), student).toPromise();
  }

  async update(id: number, student: Student): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`students/${id}`), student).toPromise();
  }

}
