import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  DataService
} from './covid19-data.service';
import {
  SummaryData,
  CountryData
} from './models/covid-data-model';
import Chart from 'chart.js';
import {
  Subject
} from 'rxjs';
import chartData from '../../components/covid19/data/chartData.json';
import countryData from '../../components/covid19/data/countryData.json';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.scss']
})
export class Covid19Component implements OnInit {
  @Input() chartTypeSubject: Subject < string > ;
  @Input() selectedCountrySubject: Subject < string > ;

  chartTypes: string[] = [''];
  countries: string[] = [''];
  chartType: string;
  summaryData: SummaryData;
  selectedCountry: string;
  selectedCountryData: CountryData;
  covid19Chart: any;
  dataSets: SummaryData[];
  allData: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.chartTypes = chartData.data.map(chart => chart.type);
    this.countries = countryData.data.map(country => country.type);

    if (!this.chartType) {
      this.chartType = this.chartTypes[0];
    }

    if (!this.selectedCountry) {
      this.selectedCountry = this.countries[3];
    }

    this.dataService.getData().subscribe(response => {
      this.allData = response;
      this.dataSets = [this.allData ? this.allData.Global: {}];
      this.summaryData = this.dataSets[0];
      this.populateChartData();
    });


    this.selectedCountrySubject.subscribe(country => {
      this.covid19Chart.destroy();
      this.selectedCountry = country;
      this.populateChartData();
    });

    this.chartTypeSubject.subscribe(type => {
      this.covid19Chart.destroy();

      this.chartType = type;
      this.populateChartData();

    });
  }

  populateChartData(): void {
    if (this.selectedCountry === this.countries[0]) {
      this.selectedCountryData = this.allData.Countries.find(x =>
        x.CountryCode === this.selectedCountry);
      this.switchChart(this.selectedCountryData);
    } else {
      this.switchChart(this.summaryData);
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getChartColours(length): string[] {
    let chartColours = [];
    for (let i = 0; i < length; i++) {
      chartColours.push(this.getRandomColor());
    }
    return chartColours;
  }

  switchChart(data: any): void {
    let config: any;
    const covid19ChartReference = 'covid19-chart';
    const covidChart = document.getElementById(covid19ChartReference);

    if (this.chartType === this.chartTypes[0]) {
      config = this.configurePieChart(data);
    } else {
      config = this.configureChart(data);
    }
    this.createChart(covidChart, config, this.chartType);

  }

  configurePieChart(data: SummaryData) {
    return {
      options: {
        legend: {
          display: false,
          labels: {
            fontColor: this.getRandomColor()
          }
        }
      },
      data: {
        labels: Object.keys(data),
        datasets: [{
          // label: Object.keys(data),
          data: Object.values(data),
          backgroundColor: this.getChartColours(Object.keys(data).length)
        }]
      }
    }
  }

  configureChart(data: SummaryData) {
    return {
      options: {
        legend: {
          display: false,
          labels: {
            fontColor: this.getRandomColor()
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: (value) => {
                if (!(value % 10)) {
                  return value;
                }
              }
            }
          }]
        }
      },
      data: {
        labels: Object.keys(data),
        datasets: [{
          // label: Object.keys(data),
          data: Object.values(data),
          backgroundColor: this.getChartColours(Object.keys(data).length)
        }]
      }
    }
  }

  createChart(covidChartRef, config, type): void {
    this.covid19Chart = new Chart(covidChartRef, {
      type: type,
      options: config.options,
      data: config.data
    });
  }
}