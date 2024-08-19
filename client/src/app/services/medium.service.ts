import {Injectable} from '@angular/core';
import {Medium} from '../entities/medium';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class MediumService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Medium[]>{
    const mediums = await this.http.get<Medium[]>(ApiManager.getURL('mediums')).toPromise();
    return mediums.map((medium) => Object.assign(new Medium(), medium));
  }

}
