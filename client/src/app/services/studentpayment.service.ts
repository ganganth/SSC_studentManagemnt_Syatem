import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Studentpayment, StudentpaymentDataPage} from '../entities/studentpayment';

@Injectable({
  providedIn: 'root'
})
export class StudentpaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<StudentpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('studentpayments');
    const studentpaymentDataPage = await this.http.get<StudentpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    studentpaymentDataPage.content = studentpaymentDataPage.content.map((studentpayment) => Object.assign(new Studentpayment(), studentpayment));
    return studentpaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<StudentpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('studentpayments/basic');
    const studentpaymentDataPage = await this.http.get<StudentpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    studentpaymentDataPage.content = studentpaymentDataPage.content.map((studentpayment) => Object.assign(new Studentpayment(), studentpayment));
    return studentpaymentDataPage;
  }

  async get(id: number): Promise<Studentpayment>{
    const studentpayment: Studentpayment = await this.http.get<Studentpayment>(ApiManager.getURL(`studentpayments/${id}`)).toPromise();
    return Object.assign(new Studentpayment(), studentpayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`studentpayments/${id}`)).toPromise();
  }

  async add(studentpayment: Studentpayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`studentpayments`), studentpayment).toPromise();
  }

  async update(id: number, studentpayment: Studentpayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`studentpayments/${id}`), studentpayment).toPromise();
  }

}
