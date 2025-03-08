import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CoverSliderComponent } from '../cover-slider/cover-slider.component';

import { fetchData1, fetchData2, fetchData3 } from '../../utils/FetchData';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    CoverSliderComponent,
  ],
})
export class Tab1Page implements OnInit {

  constructor() {}
  dataCoverSlider1: any = fetchData1.results;
  dataCoverSlider2: any = fetchData2.results;
  dataCoverSlider3: any = fetchData3.results;

  ngOnInit() {}
}