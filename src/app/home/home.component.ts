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
    textdesc: {},
    desc: "",
    image: "",
    combinedText: "",
    noText: false,
    noText2: false,
    altText: ""
  };

  analysis: any = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  alttext() {
    // if (Object.keys(this.home.textdesc).length > 0) {
    //   let textarr = [];
    //   this.home.textdesc.regions.forEach(region => {
    //     region.lines.forEach(line => {
    //       line.words.forEach(word => {
    //         textarr.push(word.text);
    //       });
    //     });
    //   });
    //   return textarr.join(" ");
    // }
  }

  apiReq(params:any, urlPath:any) {
    console.log(params)
    console.log(urlPath)
  }

  visionReq() {
    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      console.log(data);
      console.log(environment.production);
      this.analysis = data;
    })  

    // await this.apiReq(param1, "ocr").then(response => {
    //   if (response.status === 200) {
    //     this.home.textdesc = response.data;
    //   } else {
    //     this.home.noText = true;
    //   }
    // })

    // await this.apiReq(param2, "analyze").then(response => {
    //   if (response.status === 200) {
    //     this.home.desc = response.data.description.captions[0].text;
    //   } else {
    //     this.home.noText2 = true;
    //   }
    // })
  }

  fileUpload(e:any) {
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.home.image = files[0];
    this.createImage(e);
    this.visionReq();
  }
  
  useMine() {
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
    this.home.textdesc = {};
    this.home.desc = "";
    this.home.altText = "";
    this.home.combinedText = "";

    setTimeout(() => {
      //this.$refs.selectimg.focus();
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}