import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  Platform,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';

import { path_images_500 } from '../../utils/FetchData';

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
    RouterOutlet,
  ],
})
export class CoverSliderComponent implements OnInit {
  id: number;
  global: any = globalThis;
  @Input() data?: any;
  @Input() title?: any;
  pathImages: any = path_images_500;
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

  constructor(private platform: Platform, private router: Router, private routerActive:ActivatedRoute) {
    this.adjustSlidesPerView();
    this.segmentList = [];

    if (!this.global.idCoverSlider) {
      this.global.idCoverSlider = 0;
    }

    this.id = this.global.idCoverSlider;
    this.global.idCoverSlider++;
  }

  fullHeight() {
    setTimeout(() => {
      const element = this.swiperRef?.nativeElement;
      const cards = element?.getElementsByClassName('cover-card');

      if (cards) {
        if (!this.global.heightCoverSlider) {
          this.global.heightCoverSlider = [];
        } else {
          if (this.global.heightCoverSlider[this.id]) {
            this.global.heightCoverSlider[this.id] = 0;
          }
        }

        const content_cards = element?.getElementsByClassName('content-cover-card')
        const image_cards = element?.getElementsByClassName('image-cover-card')

        for (let c in cards) {
          let cardContentHeight = 0;

          for (let cc in content_cards[c].childNodes) {
            if (content_cards[c].childNodes[cc].style) {
              cardContentHeight += content_cards[c].childNodes[cc].offsetHeight;
            }
          }

          const cardHeight = image_cards[c].offsetHeight + cardContentHeight + element?.getElementsByClassName('year-card')[0].offsetHeight*1.5;

          if (cardHeight) {
            if (!this.global.heightCoverSlider[this.id]) {
              this.global.heightCoverSlider[this.id] = cardHeight;
            }

            if (this.global.heightCoverSlider[this.id] < cardHeight) {
              this.global.heightCoverSlider[this.id] = cardHeight;
            }
          }
        }

        for (let c in cards) {
          if (this.global.heightCoverSlider[this.id] && cards[c].style) {
            cards[c].style.height =
              this.global.heightCoverSlider[this.id] + 'px';
          }
        }

        for (let c in content_cards) {
          if (content_cards[c].style) {
            const height_content = (this.global.heightCoverSlider[this.id] - (image_cards[c].offsetHeight));
            content_cards[c].style.height = height_content + 'px';
          }
        }
      }
    }, 0);
  }

  ngOnInit() {

    console.log('in')
    this.routerActive.paramMap.subscribe(paramMap => {
      if (this.router.url === "/tabs/movies") {
        console.log('route: ', this.router.url)
        this.segmentList = this.data;
        
        this.resize();
        this.platform.resize.subscribe(() => {
          this.resize();
        });
      }
    })
  }

  resize() {
    this.initializeSlider();
    this.adjustSlidesPerView();
    this.fullHeight();
  }

  initializeSlider() {
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

    this.fullHeight();
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  swiperSlideChanged(e: any) {
    console.log('swiperSlideChanged', e);
  }

  _segmentSelected(index: number) {
    this.swiper?.slideTo(index);
  }

  openDetails(id: any) {
    this.router.navigate(['/details-media', id]);
  }
}
