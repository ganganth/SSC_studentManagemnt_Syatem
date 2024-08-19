import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  async getRecentEmployeeCount(): Promise<number>{
    const data = await this.http.get<any>(ApiManager.getURL('/dashboard/recent-employee-count')).toPromise();
    return data.count;
  }

  async getRecentStudentCount(): Promise<number>{
    const data = await this.http.get<any>(ApiManager.getURL('/dashboard/recent-student-count')).toPromise();
    return data.count;
  }

  async getRecentExamCount(): Promise<number>{
    const data = await this.http.get<any>(ApiManager.getURL('/dashboard/recent-exam-count')).toPromise();
    return data.count;
  }

  async getRecentExamresultCount(): Promise<number>{
    const data = await this.http.get<any>(ApiManager.getURL('/dashboard/recent-examresult-count')).toPromise();
    return data.count;
  }


}
