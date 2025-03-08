import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, Platform, NavController } from '@ionic/angular/standalone';
import { CommonModule, IMAGE_CONFIG } from '@angular/common';
import Swiper from 'swiper';
import { Router } from '@angular/router';

import { url_path } from '../../utils/FetchData';

@Component({
  selector: 'app-cover-slider',
  templateUrl: './cover-slider.component.html',
  styleUrls: ['./cover-slider.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    CoverSliderComponent,
  ],
  providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
  ],
})

export class CoverSliderComponent  implements OnInit {
  constructor(private platform: Platform, private router: Router) {
    this.adjustSlidesPerView();
    this.segmentList = [];
  }

  @Input() data?: any;
  @Input() title?: any;
  urlPath: any = url_path;
  slideOpts: any = {
    slidesPerView: 2,
    freeMode: false,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  };

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  pageSelected: any = 0;
  segmentList: Array<any>;
  selectedSegment: any;
  totalSlides: any;

  ngOnInit() {
    this.segmentList = this.data;
    this.initializePage();
    this.platform.resize.subscribe(() => {
      this.adjustSlidesPerView();
      this.initializePage();
    });
  }

  initializePage() {
    this.selectedSegment = Array(this.slideOpts.slidesPerView);
    this.totalSlides = Array(
      Math.ceil(this.segmentList.length / this.slideOpts.slidesPerView)
    );
  }

  adjustSlidesPerView() {
    const width = this.platform.width();
    if (width < 576) {
      this.slideOpts.slidesPerView = 2;
    } else if (width >= 576 && width < 768) {
      this.slideOpts.slidesPerView = 4;
    } else if (width >= 768 && width < 992) {
      this.slideOpts.slidesPerView = 6;
    } else {
      this.slideOpts.slidesPerView = 8;
    }
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
    console.error('Swiper is ready', this.swiper);
    alert('Swiper is ready');
  }

  swiperSlideChanged(e: any) {
    const index = e.target.swiper.activeIndex;
    console.error('Slide changed to index', index);
    alert('Slide changed to index ' + index);

    //this.selectedSegment = this.segmentList[index]
    this.pageSelected = index;
    this.selectedSegment = this.segmentList.slice(
      this.pageSelected,
      this.slideOpts.slidesPerView
    );
  }

  _segmentSelected(index: number) {
    this.swiper?.slideTo(index);
    console.log('index2', index);
    console.warn('index2 ' + index);
  }

  openDetails(id: any) {
    console.log(id)

    this.router.navigate(['/details-media']);
  }
}
