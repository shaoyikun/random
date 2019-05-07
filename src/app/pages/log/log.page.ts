import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Log } from 'src/app/interfaces/log';

@Component({
  selector: 'app-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
})
export class LogPage implements OnInit {

  logs:Log[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refresh();
  }

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    let api = "https://syk2018.cn/tools/random/production/log";
    this.http.get(api).subscribe((data:Log[]) => {
      if(data!=null)
        this.logs = data;
    })
  }
}
