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
  public brandslist: any[] = []
  constructor(private configService: ConfigService) {}
  ngOnInit(): void {
    this.getInfo()
  }

  @Input()
  getInfo() {
    this.configService.getAllInfo().subscribe((response: any) => {
      this.brandslist = response
      console.log(response)


    })
  }
}