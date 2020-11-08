import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { DataService } from './covid19-data.service';  
import { SummaryData, CountryData} from './models/covid-data-model';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { Subject } from 'rxjs';

const chartTypes: string[] = ['pie', 'line', 'bar'];
const countries: string[] = ['GB', 'GLOBAL'];


@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.scss']
})
export class Covid19Component implements OnInit {
  @Input() chartTypeSubject: Subject<string>;
  @Input() selectedCountrySubject: Subject<string>;

  chartType: string;
  summaryData: SummaryData;
  selectedCountry: string;
  selectedCountryData: CountryData;
  covid19Chart: any;
  dataSets: SummaryData[];
  allData: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    if(!this.chartType) {
      this.chartType = chartTypes[2];
    }

    if(!this.selectedCountry) {
      this.selectedCountry = countries[1];
    }

    this.dataService.getData().subscribe( response => {
      this.allData = response;
      this.dataSets = [this.allData?.Global];
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
      // this.switchChart(this.summaryData);

     });
  }

  populateChartData(): void{
    if (this.selectedCountry === countries[0]) {
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

    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  } 

  getChartColours(length): string[] {
    let chartColours = [];
    for (let i = 0; i < length; i++ ) {
      chartColours.push(this.getRandomColor());
  }
  return chartColours;
  }
  
  switchChart(data: any): void {
    let config: any;
    const covid19ChartReference = 'covid19-chart';
    const covidChart = document.getElementById(covid19ChartReference);

    if (this.chartType === chartTypes[0]) {
      config = this.configurePieChart(data);
    } 
    else {
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
