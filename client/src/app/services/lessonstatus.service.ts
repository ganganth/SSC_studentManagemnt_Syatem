import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Lessonstatus} from '../entities/lessonstatus';

@Injectable({
  providedIn: 'root'
})
export class LessonstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Lessonstatus[]>{
    const lessonstatuses = await this.http.get<Lessonstatus[]>(ApiManager.getURL('lessonstatuses')).toPromise();
    return lessonstatuses.map((lessonstatus) => Object.assign(new Lessonstatus(), lessonstatus));
  }

}
