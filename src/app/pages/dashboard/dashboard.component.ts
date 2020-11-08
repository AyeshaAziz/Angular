import {
  Component,
  OnInit
} from '@angular/core';
import {
  Subject
} from 'rxjs';
import chartData from '../../components/covid19/data/chartData.json';
import countryData from '../../components/covid19/data/countryData.json';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  chartType: string;
  country: string;
  chartOptions: any;
  countryOptions: any;
  selectedCountry: string;
  selectedChartType: string;
  chartTypeSubject: Subject < string > = new Subject();
  selectedCountrySubject: Subject < string > = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.selectedCountry = countryData.data[0].type;
    this.selectedChartType = chartData.data[0].type;
    this.chartOptions = chartData.data;
    this.countryOptions = countryData.data;
    this.chartType = this.selectedChartType;
    this.country = this.selectedCountry;
  }

  notifyChartOptionsUpdated() {
    this.chartTypeSubject.next(this.selectedChartType);
    this.selectedCountrySubject.next(this.selectedCountry);
  }

}