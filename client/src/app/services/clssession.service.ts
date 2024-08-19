import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Clssession, ClssessionDataPage} from '../entities/clssession';

@Injectable({
  providedIn: 'root'
})
export class ClssessionService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ClssessionDataPage>{
    const url = pageRequest.getPageRequestURL('clssessions');
    const clssessionDataPage = await this.http.get<ClssessionDataPage>(ApiManager.getURL(url)).toPromise();
    clssessionDataPage.content = clssessionDataPage.content.map((clssession) => Object.assign(new Clssession(), clssession));
    return clssessionDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ClssessionDataPage>{
    const url = pageRequest.getPageRequestURL('clssessions/basic');
    const clssessionDataPage = await this.http.get<ClssessionDataPage>(ApiManager.getURL(url)).toPromise();
    clssessionDataPage.content = clssessionDataPage.content.map((clssession) => Object.assign(new Clssession(), clssession));
    return clssessionDataPage;
  }

  async get(id: number): Promise<Clssession>{
    const clssession: Clssession = await this.http.get<Clssession>(ApiManager.getURL(`clssessions/${id}`)).toPromise();
    return Object.assign(new Clssession(), clssession);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`clssessions/${id}`)).toPromise();
  }

  async add(clssession: Clssession): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`clssessions`), clssession).toPromise();
  }

  async update(id: number, clssession: Clssession): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`clssessions/${id}`), clssession).toPromise();
  }

}
