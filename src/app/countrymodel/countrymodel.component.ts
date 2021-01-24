import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
//import { count } from 'console';
import { Color, Label } from 'ng2-charts';
import { Countrysummary } from 'src/countrysummary.model';
import { Country } from '../country.model';
import { CoronaService } from '../services/corona.service';

@Component({
  selector: 'app-countrymodel',
  templateUrl: './countrymodel.component.html',
  styleUrls: ['./countrymodel.component.css']
})
export class CountrymodelComponent implements OnInit {

  country : Country;
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
  countryname: string;
  index: number;

  constructor(public corona : CoronaService,private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.country = this.corona.getCountry();
    this.countryname = this.corona.getCountry().name;
    var currentDate  = new Date();
    currentDate.setHours(0,0,0,0);
    this.firestore.collection('country', ref=>ref.where('name','==',this.countryname))
    .valueChanges().subscribe((countrysum :any)=>{
      // console.log(countrysum[0].date)
      // console.log(currentDate.getTime())
      // console.log(countrysum)
      if( countrysum.length >0){
       if( countrysum[0].date == currentDate.getTime()){
        this.confirmed =countrysum[0].confirmed;
        this.recovered =countrysum[0].recovered;
        this.deaths = countrysum[0].deaths;
        this.newconfirmed =countrysum[0].newconfirmed;
        this.newrecovered = countrysum[0].newrecovered;
        this.newdeaths=countrysum[0].newdeaths;
        this.active =countrysum[0].active;
        this.recoveryRate =countrysum[0].recoveryRate;
        this.moryalityRate=countrysum[0].moryalityRate;
        
      }}
      if(this.confirmed ==null){
        this.corona.getSummary().subscribe((data)=>{
          for (let i = 0; i < data.Countries.length; i++){
            if (data.Countries[i].Country == this.countryname ) {
              this.index = i;
            }
          }
          this.confirmed = data.Countries[this.index].TotalConfirmed
          this.deaths = data.Countries[this.index].TotalDeaths
          this.recovered = data.Countries[this.index].TotalRecovered
          this.newconfirmed = data.Countries[this.index].NewConfirmed
          this.newdeaths = data.Countries[this.index].NewDeaths
          this.newrecovered = data.Countries[this.index].NewRecovered
          this.active = data.Countries[this.index].TotalConfirmed - data.Countries[this.index].TotalRecovered
          this.recoveryRate = (100*data.Countries[this.index].TotalRecovered / data.Countries[this.index].TotalConfirmed).toFixed(2)
          this.moryalityRate = (100*data.Countries[this.index].TotalDeaths / data.Countries[this.index].TotalConfirmed).toFixed(2)
          this.summary=data
          this.firestore.collection('country').doc().set({
            name: this.countryname,
            date: currentDate.getTime(),
            confirmed : this.confirmed,
            recovered : this.recovered,
            deaths : this.deaths,
            newconfirmed : this.newconfirmed,
            newrecovered : this.newrecovered,
            newdeaths : this.newdeaths,
            active : this.active,
            recoveryRate : this.recoveryRate,
            moryalityRate: this.moryalityRate
          }, {merge: true });

        });

      }
    } );



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
      for (let i = 0; i < data.Countries.length; i++){
        if (data.Countries[i].Country == this.countryname ) {
          this.index = i;
        }
      }
      l.push(data.Countries[this.index].TotalDeaths)
      l.push(data.Countries[this.index].TotalRecovered)
      l.push((data.Countries[this.index].TotalConfirmed - data.Countries[this.index].TotalRecovered))
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
      this.corona.getSevenDaysdatacountry(this.corona.getCountry().name).subscribe((data)=>{
        // console.log(data)
        for (let i = 0; i < 7; i++) {
          storesevendata.push(data[data.length -1-i]['Recovered']-data[data.length -2-i]['Recovered'])
      }
      })    
    return storesevendata
  }

  getNewDeathsSeven(){
    var storesevendata = []
      this.corona.getSevenDaysdatacountry(this.corona.getCountry().name).subscribe((data)=>{
        for (let i = 0; i < 7; i++) {
          storesevendata.push(data[data.length -1-i]['Deaths']-data[data.length -2-i]['Deaths'])
      }
      })    
    return storesevendata
  }


  getNewConfirmedSeven(){
    var storesevendata = []
      this.corona.getSevenDaysdatacountry(this.corona.getCountry().name).subscribe((data)=>{
        for (let i = 0; i < 7; i++) {
          storesevendata.push(data[data.length -1-i]['Confirmed']-data[data.length -2-i]['Confirmed'])
      }
      })    
    return storesevendata
  }

  
  getRecoveredTotal(){
    var storesevendata = []
      this.corona.getSevenDaysdatacountry(this.corona.getCountry().name).subscribe((data)=>{
        for (let i = 0; i < data.length; i++) {
          storesevendata.push(data[i]['Recovered'])
      }
      })    
    return storesevendata
  }

  getDeathsTotal(){
    var storesevendata = []
      this.corona.getSevenDaysdatacountry(this.corona.getCountry().name).subscribe((data)=>{
        for (let i = 0; i < data.length; i++) {
          storesevendata.push(data[i]['Deaths'])
      }
      })    
    return storesevendata
  }

  getConfirmedTotal(){
    var storesevendata = []
      this.corona.getSevenDaysdatacountry(this.corona.getCountry().name).subscribe((data)=>{
        for (let i = 0; i < data.length; i++) {
          storesevendata.push(data[i]['Confirmed'])
      }
      })    
    return storesevendata
  }
  getAllDays(){
    var l =[]
    this.corona.getSevenDaysdatacountry(this.corona.getCountry().name).subscribe((data)=>{
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
