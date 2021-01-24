import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {CoronaService} from '../services/corona.service'
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DatePipe } from '@angular/common';
import { sortedChanges } from '@angular/fire/firestore';
@
Component({
  selector: 'app-worldwide',
  templateUrl: './worldwide.component.html',
  styleUrls: ['./worldwide.component.css']
})
export class WorldwideComponent implements OnInit {

  summary:any
  confirmed : number
  recovered : number
  deaths : number
  newconfirmed : number
  newrecovered : number
  newdeaths : number
  active : number
  recoveryRate : string
  moryalityRate: string
  countrycases: any;
  allcountries =[];
  allNewConfirmed= [];
  allNewDeaths= [];
  allNewRecovered= [];
  allTotalConfirmed= [];
  allTotalDeaths= [];
  allTotalRecovered= [];


  constructor(private corona:CoronaService){}

  ngOnInit(){
    this.corona.getSummary().subscribe((data)=>{
      this.confirmed = data.Global.TotalConfirmed
      this.deaths = data.Global.TotalDeaths
      this.recovered = data.Global.TotalRecovered
      this.newconfirmed = data.Global.NewConfirmed
      this.newdeaths = data.Global.NewDeaths
      this.newrecovered = data.Global.NewRecovered
      this.active = data.Global.TotalConfirmed - data.Global.TotalRecovered
      this.recoveryRate = (100*data.Global.TotalRecovered / data.Global.TotalConfirmed).toFixed(2)
      this.moryalityRate = (100*data.Global.TotalDeaths / data.Global.TotalConfirmed).toFixed(2)
      this.summary=data
      for (let i = 0; i < data.Countries.length; i++){
        this.allcountries.push(data.Countries[i].Country);
        this.allNewConfirmed.push(data.Countries[i].NewConfirmed) ;
        this.allNewDeaths.push(data.Countries[i].NewDeaths);
        this.allNewRecovered.push(data.Countries[i].NewRecovered);
        this.allTotalConfirmed.push(data.Countries[i].TotalConfirmed);
        this.allTotalDeaths.push(data.Countries[i].TotalDeaths);
        this.allTotalRecovered.push(data.Countries[i].TotalRecovered);
      }
      // console.log(data)
      // console.log(this.allcountries.length)
    });
  }

  public pieChartOptions: ChartOptions = {
    responsive : true,
    legend:{
      position:'top',
    },
    plugins:{
      datalabels:{
        formatter:(value, ctx)=>{
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  }

  getpieChartData(){
    var l = []
    this.corona.getSummary().subscribe((data)=>{
      l.push(data.Global.TotalDeaths)
      l.push(data.Global.TotalRecovered)
      l.push((data.Global.TotalConfirmed - data.Global.TotalRecovered))
    })
    return l

  }

  getSevendays(){
    var l =[]
    var currentDate  = new Date()
    var pastDate  = new Date(currentDate)
    var pipe = new DatePipe('en-US')
    for (let i = 0; i < 7; i++) {
      var currentDate  = new Date()
      var pastDate  = new Date(currentDate)
      var pipe = new DatePipe('en-US')
      pastDate.setDate(currentDate.getDate()-6+i)
      l.push(pipe.transform(pastDate, 'MMMM dd')) 
    }
    return l
  }

  getNewRecoveredSeven(){
    var storesevendata = []
      this.corona.getSevenDaysdata().subscribe((data)=>{
        for (let i = 0; i < 7; i++) {
          storesevendata.push(data[data.length -1-i]['NewRecovered'])
      }
      })    
    return storesevendata
  }

  getNewDeathsSeven(){
    var storesevendata = []
      this.corona.getSevenDaysdata().subscribe((data)=>{
        for (let i = 0; i < 7; i++) {
          storesevendata.push(data[data.length -1-i]['NewDeaths'])
      }
      })    
    return storesevendata
  }


  getNewConfirmedSeven(){
    var storesevendata = []
      this.corona.getSevenDaysdata().subscribe((data)=>{
        for (let i = 0; i < 7; i++) {
          storesevendata.push(data[data.length -1-i]['NewConfirmed'])
      }
      })    
    return storesevendata
  }

  
  getRecoveredTotal(){
    var storesevendata = []
      this.corona.getTotalDaysdata().subscribe((data)=>{
        storesevendata.push(data[0]['TotalRecovered'])
        for (let i = 1; i < data.length; i++) {
            storesevendata.push(storesevendata[i-1]+data[i]['TotalRecovered'])
      }
      })    

    return storesevendata
  }

  getDeathsTotal(){
    var storesevendata = []
    this.corona.getTotalDaysdata().subscribe((data)=>{
      storesevendata.push(data[0]['TotalDeaths'])
      for (let i = 1; i < data.length; i++) {
          storesevendata.push(storesevendata[i-1]+data[i]['TotalDeaths'])
       }
    })
    return storesevendata
  }

  getConfirmedTotal(){
    var storesevendata = []
      this.corona.getTotalDaysdata().subscribe((data)=>{
        storesevendata.push(data[0]['TotalConfirmed'])
        for (let i = 1; i < data.length; i++) {
            storesevendata.push(storesevendata[i-1]+data[i]['TotalConfirmed'])
      }
      })
    return storesevendata
  }
  getAllDays(){
    var l =[]
    this.corona.getTotalDaysdata().subscribe((data)=>{
      for (let i = 0; i < data.length; i++) {
        var currentDate  = new Date("2020-04-13T00:00:00")
        var pastDate  = new Date("2020-04-13T00:00:00")
        var pipe = new DatePipe('en-US')    
        pastDate.setDate(currentDate.getDate() +i)
        var from = pipe.transform(pastDate, 'dd-MMM')
        l.push(from)
      }
    })
  return l
  }


  public pieChartLabels : Label[] = [["Dead Cases"], ["Recovered Cases"], ["Active Cases"]];
  public pieChartData : number[] = this.getpieChartData();
  public pieChartType: ChartType='pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor : ['rgba(255,0,0,0.3)','rgba(0,255,0,0.3)','rgba(0,0,255,0.3)'],
    },
  ];


  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = this.getSevendays();
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: this.getNewDeathsSeven(), label: 'Daily Death' },
    { data: this.getNewRecoveredSeven(), label: 'Daily Recovered' },
    { data: this.getNewConfirmedSeven(), label: 'Daily New Cases' }
  ];

  lineChartData: ChartDataSets[] = [
    { data: this.getDeathsTotal(), label: 'ToTal Death' },  
    { data: this.getRecoveredTotal(), label: 'ToTal Recovered' },
    { data: this.getConfirmedTotal(), label: 'ToTal Cases' }
  ];
  lineChartLabels: Label[] = this.getAllDays();

  lineChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
          display: false,
      },
    },
    scales: {
      yAxes: {
              reverse: true,
          }
        }
  };

  lineChartColors: Color[] = [
    {
      backgroundColor : ['rgba(255,0,0,0.3)','rgba(0,255,0,0.3)','rgba(0,0,255,0.3)'],
    },
  ];

  
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginDataLabels];

  clickonCountry(x){
    this.corona.clickonCountry(x);
  }
  clickonWorldwide(){
    this.corona.clickonWorldwide();
  }
  signInwithGoogle(){
    this.corona.signInWithGoogle();
  }
  
  clickonnews(){
    this.corona.clickonnews();
  }

}
