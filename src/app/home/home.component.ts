import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from './../../environments/environment';
import { DataService } from '../data.service';
import { Home } from '../home'

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  home: Home = {
    image: "",
    noText: false,
    noText2: false,
    altText: ""
  };

  analysis: any = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  apiReq(params:any, urlPath:any) {
    console.log(params)
    console.log(urlPath)
  }

  visionReq() {
    console.log('visionReq called')
    this.dataService.sendGetRequest(this.home.image).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      console.log(data);
      console.log(environment.production);
      this.analysis = data;
      console.log(`analysis: ${data}`)
      this.home.altText = this.analysis.analysis
    })  
  }

  fileUpload(e: any) {
    console.log('file upload called')
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    console.log(files)
    this.home.image = files[0];
    this.createImage(e);
    //this.visionReq();
  }
  
  useMine() {
    console.log('use mine')
    this.home.image =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/heygirl.jpg";
    this.visionReq();
  }
  
  createImage(e:any) {
    var image = new Image();
    var reader = new FileReader();

    reader.onload = e => {
      console.log(`createImage e is ${e}`)
      //this.home.image = e.target.result;
    };
    reader.readAsDataURL(this.home.image);
  }
  
  removeImage(e:any) {
    this.home.image = "";
    this.home.noText = false;
    this.home.noText2 = false;
    this.home.altText = "";

    setTimeout(() => {
      //this.$refs.selectimg.focus();
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}