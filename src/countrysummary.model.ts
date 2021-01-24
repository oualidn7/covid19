export class Countrysummary{
    name: string;
    date: Date;
    confirmed : number;
    recovered : number;
    deaths : number;
    newconfirmed : number;
    newrecovered : number;
    newdeaths : number;
    active : number;
    recoveryRate : string;
    moryalityRate: string;

    constructor(    date: Date, confirmed : number, recovered : number,deaths : number, newconfirmed : number,
        newrecovered : number, newdeaths : number,active : number, recoveryRate : string, moryalityRate: string){
            this.date = date;
            this.confirmed =confirmed;
            this.recovered =recovered;
            this.deaths = deaths;
            this.newconfirmed =newconfirmed;
            this.newrecovered = newrecovered;
            this.newdeaths=newdeaths;
            this.active =active;
            this.recoveryRate =recoveryRate;
            this.moryalityRate=moryalityRate;
         }

}