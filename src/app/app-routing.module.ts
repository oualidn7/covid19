import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { pathToFileURL } from 'url';
import { AuthGuard } from './auth.guard';
import { CountrymodelComponent } from './countrymodel/countrymodel.component';
import { NewsComponent } from './news/news.component';
import { SecurePagesGuard } from './secure-pages.guard';
import { SigninComponent } from './signin/signin.component';
import { WorldwideComponent } from './worldwide/worldwide.component';


const routes: Routes = [
  { path:"worldwide", component : WorldwideComponent},
  { path:"signin", component : SigninComponent},
  { path:"home", component : WorldwideComponent},
  {path:"news", component: NewsComponent},
  {path:"country/:id", component : CountrymodelComponent},
  { path:"", pathMatch: "full", redirectTo:"worlwide"},
  { path:"**", redirectTo:"worldwide"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
