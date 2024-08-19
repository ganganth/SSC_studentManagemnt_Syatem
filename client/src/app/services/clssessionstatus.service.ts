import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Clssessionstatus} from '../entities/clssessionstatus';

@Injectable({
  providedIn: 'root'
})
export class ClssessionstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Clssessionstatus[]>{
    const clssessionstatuses = await this.http.get<Clssessionstatus[]>(ApiManager.getURL('clssessionstatuses')).toPromise();
    return clssessionstatuses.map((clssessionstatus) => Object.assign(new Clssessionstatus(), clssessionstatus));
  }

}
