import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Student } from 'src/app/interfaces/student';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Log } from 'src/app/interfaces/log';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public loadingController: LoadingController,private http: HttpClient) { 

  }

  ngOnInit() {
    let api = 'https://syk2018.cn/tools/random/production/student';
    this.http.get(api).subscribe((data:Student[]) => {
      if(data != null) {
        this.students = data;
        this.max = this.students.length;
      }
    })
  }

  submitted = false;
  count = null;
  max = null;
  students:Student[];
  results:Student[];
  log:Log;

  async submit(form: NgForm) {
    this.submitted = true;

    let api = "https://syk2018.cn/tools/random/production/log";
    let reg = /^[0-9]+.?[0-9]*$/;

    if (!reg.test(this.count) || this.count == null || this.count < 0 || this.count > this.students.length) {
      return;
    }

    if (form.valid) {
      const loading = await this.loadingController.create();
      this.results = this.sort(this.count);
      await loading.present();

      this.log = {
        time:"",
        content:""
      }

      this.log.content = "<p>";
      for(let i = 0; i < this.results.length; i++) {
        this.log.content += i+1 + "." + "姓名：" + this.results[i].name + "  " + "学号：" + this.results[i].stunumber + "<br>";
      }
      this.log.content += "</p>";

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };

      console.log(this.log);

      this.http.post(api,this.log,httpOptions).subscribe((data:Log) => {
        if(data != null) {
          loading.dismiss();
        }
      })
    }
  }

  sort(count:number) {
    let shuffled = this.students.slice(0), i = this.students.length, min = i - count, temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }
}
