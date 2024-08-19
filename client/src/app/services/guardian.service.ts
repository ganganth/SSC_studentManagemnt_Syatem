import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Guardian, GuardianDataPage} from '../entities/guardian';

@Injectable({
  providedIn: 'root'
})
export class GuardianService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<GuardianDataPage>{
    const url = pageRequest.getPageRequestURL('guardians');
    const guardianDataPage = await this.http.get<GuardianDataPage>(ApiManager.getURL(url)).toPromise();
    guardianDataPage.content = guardianDataPage.content.map((guardian) => Object.assign(new Guardian(), guardian));
    return guardianDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<GuardianDataPage>{
    const url = pageRequest.getPageRequestURL('guardians/basic');
    const guardianDataPage = await this.http.get<GuardianDataPage>(ApiManager.getURL(url)).toPromise();
    guardianDataPage.content = guardianDataPage.content.map((guardian) => Object.assign(new Guardian(), guardian));
    return guardianDataPage;
  }

  async get(id: number): Promise<Guardian>{
    const guardian: Guardian = await this.http.get<Guardian>(ApiManager.getURL(`guardians/${id}`)).toPromise();
    return Object.assign(new Guardian(), guardian);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`guardians/${id}`)).toPromise();
  }

  async add(guardian: Guardian): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`guardians`), guardian).toPromise();
  }

  async update(id: number, guardian: Guardian): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`guardians/${id}`), guardian).toPromise();
  }

}
