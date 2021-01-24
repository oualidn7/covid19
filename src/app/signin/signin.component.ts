import { Component, OnInit } from '@angular/core';
import { User } from 'src/user.model';
import { News } from '../news.module';
import { NewsComponent } from '../news/news.component';
import { CoronaService } from '../services/corona.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  user : User;
  news: News[];
  datetoadd : any;
  newstoadd : string;

  constructor(public coronaService: CoronaService) { }

  ngOnInit(): void {
    this.user = this.coronaService.getUser();
    this.coronaService.getNews().subscribe((news : News[])=>{
      this.news = news
    });
  };

  addnews(){
    let news :News = {
      date : new Date(this.datetoadd),
      data : this.newstoadd
    }
    this.coronaService.addnews(news)
    this.datetoadd=undefined;
    this.newstoadd=undefined;
  }

}
