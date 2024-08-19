import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Cls, ClsDataPage} from '../entities/cls';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';

@Injectable({
  providedIn: 'root'
})
export class ClsService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ClsDataPage>{
    const url = pageRequest.getPageRequestURL('clses');
    const clsDataPage = await this.http.get<ClsDataPage>(ApiManager.getURL(url)).toPromise();
    clsDataPage.content = clsDataPage.content.map((cls) => Object.assign(new Cls(), cls));
    return clsDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ClsDataPage>{
    const url = pageRequest.getPageRequestURL('clses/basic');
    const clsDataPage = await this.http.get<ClsDataPage>(ApiManager.getURL(url)).toPromise();
    clsDataPage.content = clsDataPage.content.map((cls) => Object.assign(new Cls(), cls));
    return clsDataPage;
  }

  async get(id: number): Promise<Cls>{
    const cls: Cls = await this.http.get<Cls>(ApiManager.getURL(`clses/${id}`)).toPromise();
    return Object.assign(new Cls(), cls);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`clses/${id}`)).toPromise();
  }

  async add(cls: Cls): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`clses`), cls).toPromise();
  }

  async update(id: number, cls: Cls): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`clses/${id}`), cls).toPromise();
  }

}
