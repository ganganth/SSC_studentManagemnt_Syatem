import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Ethnicity} from '../entities/ethnicity';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class EthnicityService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Ethnicity[]>{
    const ethnicities = await this.http.get<Ethnicity[]>(ApiManager.getURL('ethnicities')).toPromise();
    return ethnicities.map((ethnicity) => Object.assign(new Ethnicity(), ethnicity));
  }

}
