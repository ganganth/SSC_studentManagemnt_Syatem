import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Timetable, TimetableDataPage} from '../entities/timetable';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<TimetableDataPage>{
    const url = pageRequest.getPageRequestURL('timetables');
    const timetableDataPage = await this.http.get<TimetableDataPage>(ApiManager.getURL(url)).toPromise();
    timetableDataPage.content = timetableDataPage.content.map((timetable) => Object.assign(new Timetable(), timetable));
    return timetableDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<TimetableDataPage>{
    const url = pageRequest.getPageRequestURL('timetables/basic');
    const timetableDataPage = await this.http.get<TimetableDataPage>(ApiManager.getURL(url)).toPromise();
    timetableDataPage.content = timetableDataPage.content.map((timetable) => Object.assign(new Timetable(), timetable));
    return timetableDataPage;
  }

  async get(id: number): Promise<Timetable>{
    const timetable: Timetable = await this.http.get<Timetable>(ApiManager.getURL(`timetables/${id}`)).toPromise();
    return Object.assign(new Timetable(), timetable);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`timetables/${id}`)).toPromise();
  }

  async add(timetable: Timetable): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`timetables`), timetable).toPromise();
  }

  async update(id: number, timetable: Timetable): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`timetables/${id}`), timetable).toPromise();
  }

}
