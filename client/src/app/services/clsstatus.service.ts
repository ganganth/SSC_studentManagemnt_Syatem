import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Clsstatus} from '../entities/clsstatus';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class ClsstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Clsstatus[]>{
    const clsstatuses = await this.http.get<Clsstatus[]>(ApiManager.getURL('clsstatuses')).toPromise();
    return clsstatuses.map((clsstatus) => Object.assign(new Clsstatus(), clsstatus));
  }

}
