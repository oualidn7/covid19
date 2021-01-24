import { Component, OnInit } from '@angular/core';
import { News } from '../news.module';
import { CoronaService } from '../services/corona.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[];
  constructor(public coronaService: CoronaService) { }

  ngOnInit(): void {
    this.news =this.coronaService.getallNews();
  }
  clickonWorldwide(){
    this.coronaService.clickonWorldwide();
  }
  signInwithGoogle(){
    this.coronaService.signInWithGoogle();
  }
  clickonnews(){
    this.coronaService.clickonnews();
  }
}
