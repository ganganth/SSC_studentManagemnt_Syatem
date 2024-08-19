import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Enrollment, EnrollmentDataPage} from '../entities/enrollment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<EnrollmentDataPage>{
    const url = pageRequest.getPageRequestURL('enrollments');
    const enrollmentDataPage = await this.http.get<EnrollmentDataPage>(ApiManager.getURL(url)).toPromise();
    enrollmentDataPage.content = enrollmentDataPage.content.map((enrollment) => Object.assign(new Enrollment(), enrollment));
    return enrollmentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<EnrollmentDataPage>{
    const url = pageRequest.getPageRequestURL('enrollments/basic');
    const enrollmentDataPage = await this.http.get<EnrollmentDataPage>(ApiManager.getURL(url)).toPromise();
    enrollmentDataPage.content = enrollmentDataPage.content.map((enrollment) => Object.assign(new Enrollment(), enrollment));
    return enrollmentDataPage;
  }

  async get(id: number): Promise<Enrollment>{
    const enrollment: Enrollment = await this.http.get<Enrollment>(ApiManager.getURL(`enrollments/${id}`)).toPromise();
    return Object.assign(new Enrollment(), enrollment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`enrollments/${id}`)).toPromise();
  }

  async add(enrollment: Enrollment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`enrollments`), enrollment).toPromise();
  }

  async update(id: number, enrollment: Enrollment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`enrollments/${id}`), enrollment).toPromise();
  }

}
