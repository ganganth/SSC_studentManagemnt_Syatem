import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Lesson, LessonDataPage} from '../entities/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<LessonDataPage>{
    const url = pageRequest.getPageRequestURL('lessons');
    const lessonDataPage = await this.http.get<LessonDataPage>(ApiManager.getURL(url)).toPromise();
    lessonDataPage.content = lessonDataPage.content.map((lesson) => Object.assign(new Lesson(), lesson));
    return lessonDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<LessonDataPage>{
    const url = pageRequest.getPageRequestURL('lessons/basic');
    const lessonDataPage = await this.http.get<LessonDataPage>(ApiManager.getURL(url)).toPromise();
    lessonDataPage.content = lessonDataPage.content.map((lesson) => Object.assign(new Lesson(), lesson));
    return lessonDataPage;
  }

  async get(id: number): Promise<Lesson>{
    const lesson: Lesson = await this.http.get<Lesson>(ApiManager.getURL(`lessons/${id}`)).toPromise();
    return Object.assign(new Lesson(), lesson);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`lessons/${id}`)).toPromise();
  }

  async add(lesson: Lesson): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`lessons`), lesson).toPromise();
  }

  async update(id: number, lesson: Lesson): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`lessons/${id}`), lesson).toPromise();
  }

}
