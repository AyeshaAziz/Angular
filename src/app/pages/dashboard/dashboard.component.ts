import { Component, OnInit, EventEmitter } from '@angular/core';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chartData = [{
    'type': 'bar',
    'label': 'Bar Chart',
  },
  {
    'type': 'pie',
    'label': 'Pie Chart',
  },
  {
    'type': 'line',
    'label': 'Line Chart',
  }];

  countryData = [{
    'type': 'GB',
    'label': 'United Kingdom',
  },
  {
    'type': 'GLOBAL',
    'label': 'Global',
  }];

  chartType: string; 
  country: string;
  selectedCountry: string = this.countryData[0].type;
  selectedChartType: string = this.chartData[0].type;
  chartTypeSubject: Subject<string> = new Subject();
  selectedCountrySubject: Subject<string> = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.chartType = this.selectedChartType;
    this.country = this.selectedCountry;
  }

  notifyChartOptionsUpdated() {
    this.chartTypeSubject.next(this.selectedChartType);
    this.selectedCountrySubject.next(this.selectedCountry);
  }

  // countryChanged() {
  //   this.selectedCountrySubject.next(this.selectedCountry);
  // }

}
