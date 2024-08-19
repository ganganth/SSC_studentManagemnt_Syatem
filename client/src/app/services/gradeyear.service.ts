import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Gradeyear, GradeyearDataPage} from '../entities/gradeyear';

@Injectable({
  providedIn: 'root'
})
export class GradeyearService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<GradeyearDataPage>{
    const url = pageRequest.getPageRequestURL('gradeyears');
    const gradeyearDataPage = await this.http.get<GradeyearDataPage>(ApiManager.getURL(url)).toPromise();
    gradeyearDataPage.content = gradeyearDataPage.content.map((gradeyear) => Object.assign(new Gradeyear(), gradeyear));
    return gradeyearDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<GradeyearDataPage>{
    const url = pageRequest.getPageRequestURL('gradeyears/basic');
    const gradeyearDataPage = await this.http.get<GradeyearDataPage>(ApiManager.getURL(url)).toPromise();
    gradeyearDataPage.content = gradeyearDataPage.content.map((gradeyear) => Object.assign(new Gradeyear(), gradeyear));
    return gradeyearDataPage;
  }

  async get(id: number): Promise<Gradeyear>{
    const gradeyear: Gradeyear = await this.http.get<Gradeyear>(ApiManager.getURL(`gradeyears/${id}`)).toPromise();
    return Object.assign(new Gradeyear(), gradeyear);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`gradeyears/${id}`)).toPromise();
  }

  async add(gradeyear: Gradeyear): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`gradeyears`), gradeyear).toPromise();
  }

  async update(id: number, gradeyear: Gradeyear): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`gradeyears/${id}`), gradeyear).toPromise();
  }

}
