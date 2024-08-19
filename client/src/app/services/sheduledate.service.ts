import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Sheduledate, SheduledateDataPage} from '../entities/sheduledate';

@Injectable({
  providedIn: 'root'
})
export class SheduledateService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<SheduledateDataPage>{
    const url = pageRequest.getPageRequestURL('sheduledates');
    const sheduledateDataPage = await this.http.get<SheduledateDataPage>(ApiManager.getURL(url)).toPromise();
    sheduledateDataPage.content = sheduledateDataPage.content.map((sheduledate) => Object.assign(new Sheduledate(), sheduledate));
    return sheduledateDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<SheduledateDataPage>{
    const url = pageRequest.getPageRequestURL('sheduledates/basic');
    const sheduledateDataPage = await this.http.get<SheduledateDataPage>(ApiManager.getURL(url)).toPromise();
    sheduledateDataPage.content = sheduledateDataPage.content.map((sheduledate) => Object.assign(new Sheduledate(), sheduledate));
    return sheduledateDataPage;
  }

  async get(id: number): Promise<Sheduledate>{
    const sheduledate: Sheduledate = await this.http.get<Sheduledate>(ApiManager.getURL(`sheduledates/${id}`)).toPromise();
    return Object.assign(new Sheduledate(), sheduledate);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`sheduledates/${id}`)).toPromise();
  }

  async add(sheduledate: Sheduledate): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`sheduledates`), sheduledate).toPromise();
  }

  async update(id: number, sheduledate: Sheduledate): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`sheduledates/${id}`), sheduledate).toPromise();
  }

}
