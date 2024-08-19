import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Materialissue, MaterialissueDataPage} from '../entities/materialissue';

@Injectable({
  providedIn: 'root'
})
export class MaterialissueService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<MaterialissueDataPage>{
    const url = pageRequest.getPageRequestURL('materialissues');
    const materialissueDataPage = await this.http.get<MaterialissueDataPage>(ApiManager.getURL(url)).toPromise();
    materialissueDataPage.content = materialissueDataPage.content.map((materialissue) => Object.assign(new Materialissue(), materialissue));
    return materialissueDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<MaterialissueDataPage>{
    const url = pageRequest.getPageRequestURL('materialissues/basic');
    const materialissueDataPage = await this.http.get<MaterialissueDataPage>(ApiManager.getURL(url)).toPromise();
    materialissueDataPage.content = materialissueDataPage.content.map((materialissue) => Object.assign(new Materialissue(), materialissue));
    return materialissueDataPage;
  }

  async get(id: number): Promise<Materialissue>{
    const materialissue: Materialissue = await this.http.get<Materialissue>(ApiManager.getURL(`materialissues/${id}`)).toPromise();
    return Object.assign(new Materialissue(), materialissue);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`materialissues/${id}`)).toPromise();
  }

  async add(materialissue: Materialissue): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`materialissues`), materialissue).toPromise();
  }

  async update(id: number, materialissue: Materialissue): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`materialissues/${id}`), materialissue).toPromise();
  }

}
