import {House} from '../entities/house';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<House[]>{
    const houses = await this.http.get<House[]>(ApiManager.getURL('houses')).toPromise();
    return houses.map((house) => Object.assign(new House(), house));
  }

}
