import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { UserService } from 'src/app/services/user.service';
import { AbstractComponent } from 'src/app/shared/abstract-component';
import { LoggedUser } from 'src/app/shared/logged-user';
import { UsecaseList } from 'src/app/usecase-list';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AbstractComponent implements OnInit {

  studentCount: number;
  academicStaffCount: number;

  constructor(
    private userService: UserService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<any> {

    const dashDetails = await this.userService.getDashboardDetails();
    this.studentCount = dashDetails.studentCount;
    this.academicStaffCount = dashDetails.employeeCount;
    const reportDetails = dashDetails.reportData;

    const chart1data = Array.isArray(reportDetails) ? reportDetails.map(r => r.total_student) : [];
    const chart2data = Array.isArray(reportDetails) ? reportDetails.map(r => r.credit_A) : [];

    new Chart("chart-1", {
      type: 'bar',
      data: {
        labels: ['Grade: 1', 'Grade: 2', 'Grade: 3', 'Grade: 4', 'Grade: 5', 'Grade: 6', 'Grade: 7', 'Grade: 8', 'Grade: 9', 'Grade: 10', 'Grade: 11', 'Grade: 12', 'Grade: 13'],
        datasets: [{
          label: 'Number of student in class.',
          data: chart1data,
          borderWidth: 1,
          backgroundColor: '#228B22',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });


    const data = {
      labels: ['Grade: 1', 'Grade: 2', 'Grade: 3', 'Grade: 4', 'Grade: 5', 'Grade: 6', 'Grade: 7', 'Grade: 8', 'Grade: 9', 'Grade: 10', 'Grade: 11', 'Grade: 12', 'Grade: 13'],
      datasets: [{
        label: 'Number of A Pass.',
        data: chart2data,
        backgroundColor: '#228B22',
        tension: 0.1
      }]
    };
    new Chart('chart-2', {
      type: 'line',
      data: data,
    });

  }

  updatePrivileges(): any {
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_REPORT);
  }

}
