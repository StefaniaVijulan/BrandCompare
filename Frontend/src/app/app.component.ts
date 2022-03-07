import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  ConfigService
} from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  public startDate: Date;
  public endDate: Date;
  public brandslist: any[] = []
  constructor(private configService: ConfigService, private http: HttpClient) {}
  ngOnInit(): void {
    //this.getInfo()
  }
  getLog(startDate, endDate) {
    let par = new HttpParams();
    console.log(this.startDate)
    console.log(this.endDate)
    par = par.append('dataStart', startDate)
    par = par.append('dataEnd', endDate)
    console.log(par)
    return this.http.get(`http://localhost:8000/info`, {
      params: par
    })
  }
  //@Input()
  getInfo() {
    this.getLog(this.startDate, this.endDate).subscribe((response: any) => {
      this.brandslist = response
      console.log(response)


    })
  }
}