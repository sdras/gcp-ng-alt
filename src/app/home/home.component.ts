import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
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
    altText: "",
    uiState: "idle"
  };

  vision: any = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  visionReq() {
    console.log('visionReq called')
    this.home.uiState = 'loading'
    this.dataService.sendGetRequest(this.home.image).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.vision = data;
      this.home.uiState = 'completed'
      console.log(`analysis: ${data}`)
      this.home.altText = this.vision.analysis
    })  
  }

  useUrlImg() {
    this.visionReq();
  }

  useMine() {
    this.home.image =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/heygirl.jpg";
    this.visionReq();
  }

  fileUpload(e: any) {
    console.log('file upload called')
    console.log(`e is ${e}`)
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    console.log(files)
    this.home.image = files[0];
    this.createImage(e);
    //this.visionReq();
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
    this.home.altText = "";
    this.home.uiState = "idle"

    setTimeout(() => {
      //this.$refs.selectimg.focus();
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}