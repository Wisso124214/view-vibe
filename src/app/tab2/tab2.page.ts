import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { SliderComponent } from '../slider/slider.component';
import { CardCoverComponent } from '../cards/cover/cover.component';

import { url_api } from '../../utils/FetchData';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    SliderComponent,
    CardCoverComponent,
    CommonModule,
  ],
})
export class Tab2Page {
  constructor() {}

  global: any = globalThis;
  url_api: any = url_api;
  data: any = null;
  isLoading: boolean = false;
  @ViewChild('grid_cards') grid_cards:
    | ElementRef
    | undefined;

  ngOnInit() {
    this.fetchData();
  }

  ngAgterViewInit() {
    const element = this.grid_cards?.nativeElement;
  }

  async fetchData() {
    await fetch(url_api + '/get-movies')
      .then((response) => response.json())
      .then((data) => {
        this.data = data;
        console.log('Data fetched:', this.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  goBack() {
    this.global.history.back();
  }
}
