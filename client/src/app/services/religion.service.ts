import {Injectable} from '@angular/core';
import {Religion} from '../entities/religion';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class ReligionService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Religion[]>{
    const religions = await this.http.get<Religion[]>(ApiManager.getURL('religions')).toPromise();
    return religions.map((religion) => Object.assign(new Religion(), religion));
  }

}
