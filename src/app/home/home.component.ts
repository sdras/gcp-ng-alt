import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
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
    imageURL: "",
    altText: "",
    uiState: "idle"
  };

  vision: any = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  visionReq(imgObj: object) {
    console.log('visionReq called')
    this.home.uiState = 'loading'
    this.dataService.sendRequest(imgObj).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.vision = data;
      this.home.uiState = 'completed'
      console.log(`analysis: ${JSON.stringify(data, null, 2)}`)
      this.home.altText = this.vision.analysis
    })  
  }

  useUrlImg() {
    this.home.image = this.home.imageURL;
    this.visionReq({ imageUrl: this.home.imageURL });
  }

  useMine() {
    let mine = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/heygirl.jpg"
    this.home.image = mine;
    this.visionReq({ imageUrl: mine });
  }

  fileUpload(e: any) {
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) console.warn('Something went wrong reading the file');
    this.createImage(files[0]);
  }
  
  createImage(file:any) {
    let reader = new FileReader();
    let img: any
    
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.home.image = reader.result
      // take the result, make sure it's a string and then string out the beginning
      // because GCP expects just the string
      img = reader.result?.toString().replace("data:image/jpeg;base64,", "");
      this.visionReq({ imageData: img });
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }
  
  removeImage(e:any) {
    this.home.image = "";
    this.home.imageURL = "";
    this.home.altText = "";
    this.home.uiState = "idle"

    setTimeout(() => {
      // TODO: get the ref
      // this.$refs.selectimg.focus();
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}