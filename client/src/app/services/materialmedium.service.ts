import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Materialmedium} from '../entities/materialmedium';

@Injectable({
  providedIn: 'root'
})
export class MaterialmediumService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Materialmedium[]>{
    const materialmediums = await this.http.get<Materialmedium[]>(ApiManager.getURL('materialmediums')).toPromise();
    return materialmediums.map((materialmedium) => Object.assign(new Materialmedium(), materialmedium));
  }

}
