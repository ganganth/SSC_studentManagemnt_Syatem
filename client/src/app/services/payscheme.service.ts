import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Payscheme} from '../entities/payscheme';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class PayschemeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Payscheme[]>{
    const payschemes = await this.http.get<Payscheme[]>(ApiManager.getURL('payschemes')).toPromise();
    return payschemes.map((payscheme) => Object.assign(new Payscheme(), payscheme));
  }

}
