import { Component, OnInit } from '@angular/core';
import {ThemeManager} from '../../../../shared/views/theme-manager';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
// @ts-ignore
import {ReportService} from '../../../../services/report.service';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ReportHelper} from '../../../../shared/report-helper';

@Component({
  selector: 'app-year-wise-student-count',
  templateUrl: './year-wise-student-count.component.html',
  styleUrls: ['./year-wise-student-count.component.scss']
})
export class YearWiseStudentCountComponent extends AbstractComponent implements OnInit {
  yearWiseData: any[];

  get isDark(): boolean{
    return ThemeManager.isDark();
  }

  public lineChartData: ChartDataSets[] = [
    {data: [], label: 'Count'},
  ];

  public lineChartLabels: Label[] = [];
  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: { fontColor: '#ccc' },
        gridLines: { color: 'rgba(128,128,128,0.5)' }
      }],
      yAxes: [{
        ticks: { fontColor: '#ccc' },
        gridLines: { color: 'rgba(128,128,128,0.5)' }
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(97,189,30,0.58)',
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'bar';
  public lineChartPlugins = [];

  displayedColumns: string[] = ['year', 'count'];
  constructor(private reportService: ReportService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{
    this.yearWiseData = await this.reportService.getYearWiseStudentCount(10);
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];

    for (const yearData of this.yearWiseData){
      this.lineChartLabels.unshift(yearData.year);
      this.lineChartData[0].data.unshift(yearData.count);
    }

  }

  updatePrivileges(): void{

  }

  print(): void{
    ReportHelper.print('yearWiseStudentReport');
  }

}
