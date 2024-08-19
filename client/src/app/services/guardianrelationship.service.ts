import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Guardianrelationship} from '../entities/guardianrelationship';

@Injectable({
  providedIn: 'root'
})
export class GuardianrelationshipService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Guardianrelationship[]>{
    const guardianrelationships = await this.http.get<Guardianrelationship[]>(ApiManager.getURL('guardianrelationships')).toPromise();
    return guardianrelationships.map((guardianrelationship) => Object.assign(new Guardianrelationship(), guardianrelationship));
  }

}
