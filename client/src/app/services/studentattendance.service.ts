import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Studentattendance, StudentattendanceDataPage} from '../entities/studentattendance';

@Injectable({
  providedIn: 'root'
})
export class StudentattendanceService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<StudentattendanceDataPage>{
    const url = pageRequest.getPageRequestURL('studentattendances');
    const studentattendanceDataPage = await this.http.get<StudentattendanceDataPage>(ApiManager.getURL(url)).toPromise();
    studentattendanceDataPage.content = studentattendanceDataPage.content.map((studentattendance) => Object.assign(new Studentattendance(), studentattendance));
    return studentattendanceDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<StudentattendanceDataPage>{
    const url = pageRequest.getPageRequestURL('studentattendances/basic');
    const studentattendanceDataPage = await this.http.get<StudentattendanceDataPage>(ApiManager.getURL(url)).toPromise();
    studentattendanceDataPage.content = studentattendanceDataPage.content.map((studentattendance) => Object.assign(new Studentattendance(), studentattendance));
    return studentattendanceDataPage;
  }

  async get(id: number): Promise<Studentattendance>{
    const studentattendance: Studentattendance = await this.http.get<Studentattendance>(ApiManager.getURL(`studentattendances/${id}`)).toPromise();
    return Object.assign(new Studentattendance(), studentattendance);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`studentattendances/${id}`)).toPromise();
  }

  async add(studentattendance: Studentattendance): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`studentattendances`), studentattendance).toPromise();
  }

  async update(id: number, studentattendance: Studentattendance): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`studentattendances/${id}`), studentattendance).toPromise();
  }

}
