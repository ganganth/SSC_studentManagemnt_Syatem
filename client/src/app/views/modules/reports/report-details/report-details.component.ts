import { Component, OnInit } from '@angular/core';
import { LoggedUser } from 'src/app/shared/logged-user';
import { UsecaseList } from 'src/app/usecase-list';
import { UserDataPage } from 'src/app/entities/user';
import { UserService } from 'src/app/services/user.service';
import { AbstractComponent } from 'src/app/shared/abstract-component';
import { FormControl, FormGroup } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent extends AbstractComponent implements OnInit {

  title1: string = '';
  title2: string = '';
  title3: string = '';
  chartInstances: { [key: string]: any } = {};

  constructor(
    private userService: UserService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData()
    this.getFirstChatData(13);
    this.getSecondChatData(13);
    this.getThirdChatData('A')
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
  }

  updatePrivileges(): any {
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_REPORT);
  }

  printPieChart(chartName: string, labelsSet: string[], dataSet: number[], colorSet: string[]): void {
   
    if (this.chartInstances[chartName]) {
      this.chartInstances[chartName].destroy(); 
    }

    this.chartInstances[chartName] = new Chart(chartName, {
      type: 'pie',
      data: {
        labels: labelsSet,
        datasets: [{
          data: dataSet,
          borderWidth: 1,
          backgroundColor: colorSet,
        }]
      }
    });
  }

  async getFirstChatData(grade: number) {
    this.title1 = `Grade ${grade} student Attendance.`;
    const chartName = 'chart-1';
    const labels = ['Present Student', 'Absent Student'];
    const color = ['#006400', '#228B22']
    const data = await this.userService.getDetails2(grade);
    const dataset = [data[0].present_student, data[0].absent_student];
    this.printPieChart(chartName, labels, dataset, color);
  }

  async getSecondChatData(grade: number) {
    this.title2 = `Grade ${grade} student number of Pass Marks.`
    const chartName = 'chart-2'
    const labels = ['A', 'B', 'C', 'D', 'F'];
    const color = ['#006400', '#228B22', '#2E8B57', '#32CD32', '#3CB371']
    const data = await this.userService.getDetails1(grade);
    const dataset = [data[0].credit_A, data[0].credit_B, data[0].credit_C, data[0].credit_D, data[0].credit_F];
    this.printPieChart(chartName, labels, dataset, color);
  }

  async getThirdChatData(marks: string) {
    console.log(marks)
    this.title3 = `Number Of ${marks} passes in all grades.`
    const chartName = 'chart-3'
    const data = await this.userService.getDetails3(marks);
    const labels = ['Grade: 1', 'Grade: 2', 'Grade: 3', 'Grade: 4', 'Grade: 5', 'Grade: 6', 'Grade: 7', 'Grade: 8', 'Grade: 9', 'Grade: 10', 'Grade: 11', 'Grade: 12', 'Grade: 13'];
    const color = ["#006400", "#228B22", "#2E8B57", "#32CD32", "#3CB371", "#00FF00", "#7FFF00", "#00FA9A", "#90EE90", "#8FBC8F", "#98FB98", "#9ACD32", "#ADFF2F"]
    let dataset = [];

    if (marks === 'A') {
      dataset = Array.isArray(data) ? data.map(r => r.credit_A) : [];
    } else if (marks === 'B') {
      dataset = Array.isArray(data) ? data.map(r => r.credit_B) : [];
    } else if (marks === 'C') {
      dataset = Array.isArray(data) ? data.map(r => r.credit_C) : [];
    } else if (marks === 'D') {
      dataset = Array.isArray(data) ? data.map(r => r.credit_D) : [];
    } else {
      dataset = Array.isArray(data) ? data.map(r => r.credit_F) : [];
    }

    this.printPieChart(chartName, labels, dataset, color);
  }

}
