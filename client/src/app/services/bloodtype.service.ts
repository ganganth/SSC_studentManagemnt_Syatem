import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Bloodtype} from '../entities/bloodtype';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class BloodtypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Bloodtype[]>{
    const bloodtypes = await this.http.get<Bloodtype[]>(ApiManager.getURL('bloodtypes')).toPromise();
    return bloodtypes.map((bloodtype) => Object.assign(new Bloodtype(), bloodtype));
  }

}
