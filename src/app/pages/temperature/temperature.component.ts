import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DataService } from '../../services/data.service';
import { TemperatureService } from '../../services/temperature.service';
import { ClientAPIService } from '../../services/client-api.service';
import { TemperatureApiResponse, TemperatureData } from '../../models/temperatureData.model';
import { isPlatformBrowser } from '@angular/common';
import * as echarts from 'echarts';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.scss',
})
export class TemperatureComponent implements OnInit {
  titleTemperature = 'Temperature Globali';
  contentTemperature!: string;
  apiType = 'temperature';
  legendTemperature!: string;
  temperatureData: TemperatureData[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartOption: any;

  constructor(
    private dataService: DataService,
    private temperatureService: TemperatureService,
    private clientApi: ClientAPIService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.dataService.changeTitle(this.titleTemperature);
    this.contentTemperature = this.temperatureService.getTemperatureParagraph();
    this.dataService.changeContent(this.contentTemperature);
    this.clientApi.getData<TemperatureApiResponse>(this.apiType).subscribe((response: TemperatureApiResponse )=> {
      this.temperatureData = response.result;
      if (isPlatformBrowser(this.platformId)) {
        this.createTemperatureChart();
      }
    });
    this.legendTemperature = this.temperatureService.getTemperatureLegend();
    this.dataService.changeLegend(this.legendTemperature);
  }

  createTemperatureChart() {
    if (isPlatformBrowser(this.platformId)) {
      const chartDom = document.getElementById('temperatureChart');
      const myChart = echarts.init(chartDom, null, {
        width: 'auto',
        height: 'auto'
      });
      
      const dates = this.temperatureData.map((data) => {
        const [year, month] = data.time.split('.');
        return `${('0' + month).slice(-2)}-${year}`;
      });
      const station = this.temperatureData.map((data) => data.station);
      const land = this.temperatureData.map((data) => data.land);

      this.chartOption = {
        title: {
          text: 'Global Temperature',
          left: 'auto',
          textStyle: {
            color: '#f79824'
         }
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['Station', 'Land'],
          top: 'top', 
          right: 'right', 
          textStyle: {
             color: '#f79824'
          }
        },
        grid: {
          left: '10%', 
          right: '10%', 
          top: '15%', 
          bottom: '15%', 
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            magicType: { type: ['line', 'bar'] },
            restore: {},
          },
          top: 'bottom',
          left: 'center'
          
        },
        xAxis: {
          type: 'category',
          data: dates,
        },
        yAxis: {
          name: 'Global temperature (celsius)',
          min: -1.5,
          max: 2,
          axisLabel: {
            formatter: '{value}',
          },
          
        },
        series: [
          {
            name: 'Station',
            type: 'line',
            data: station,
            showSymbol: false,
            encode: {
              x: 'Year',
              y: 'Station',
              itemName: 'Year',
              tooltip: ['Station'],
            },
          },
          {
            name: 'Land',
            type: 'line',
            data: land,
            showSymbol: false,
            encode: {
              x: 'Year',
              y: 'Land',
              itemName: 'Year',
              tooltip: ['Land'],
            },
          },
        ],
      };
      myChart.setOption(this.chartOption);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    }
  }

  convertDecimalYearToMonthYear(decimalYear: number) {
    const year = Math.floor(decimalYear);
    const decimalPart = decimalYear - year;
    const month = Math.round(decimalPart * 12);
  
    // Assicurati che il mese sia sempre a due cifre
    const formattedMonth = ('0' + month).slice(-2);
  
    return `${formattedMonth}-${year}`;
  }


}


