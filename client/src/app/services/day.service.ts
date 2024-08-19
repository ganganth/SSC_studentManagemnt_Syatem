import {Day} from '../entities/day';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Day[]>{
    const days = await this.http.get<Day[]>(ApiManager.getURL('days')).toPromise();
    return days.map((day) => Object.assign(new Day(), day));
  }

}
