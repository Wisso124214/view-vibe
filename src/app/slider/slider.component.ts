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
import { IonImg } from '@ionic/angular/standalone';
import { path_images_500, url_api } from '../../utils/FetchData';
import { CardCoverComponent } from '../cards/cover/cover.component';
import { CardCastComponent } from '../cards/cast/cast.component';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    SliderComponent,
    RouterOutlet,
    IonImg,
    CardCoverComponent,
    CardCastComponent,
  ],
})
export class SliderComponent implements OnInit {
  id: any;
  global: any = globalThis;
  @Input() title?: any;
  @Input() url?: any;
  @Input() type?: any;
  @Input() is_paginated: any = false;
  @Input() desired_width_px: any;
  @Input() exceptions_width: any;
  @Input() data: any = null;
  @Input() route: any = null;

  defaultDesireWidth: number = 0;

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

  segmentList: Array<any> = [];
  selectedSegment: any;
  totalSlides: any;
  page: any = 0;
  isLoading: boolean = false;

  options: any = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTE3ZDc0ZTdkOTZjNWI5ZTJkYWRiMGYxMzU2NmI5YSIsIm5iZiI6MTc0MTM5MTQxMS4zMDMsInN1YiI6IjY3Y2I4NjMzYTRkZjk3ZGI5NjRmNjg3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eGIHpPLr1waotJ5nHWUTMIqqt4fKA3JGGkc9lq75wLs',
    },
    // signal: AbortSignal.timeout(5000),
  };

  constructor(
    private platform: Platform,
    private router: Router,
    private routerActive: ActivatedRoute
  ) {
    if (!this.global.idCoverSlider) {
      this.global.idCoverSlider = 0;
    }
  }

  fullHeight() {
    setTimeout(() => {
      const element = this.swiperRef?.nativeElement;
      const cards = element?.getElementsByClassName('slide-card');
      const noImage = element?.getElementsByClassName('no-image');

      const images: any = document.querySelectorAll('.image-slide-card');

      for (let i in noImage) {
        if (noImage[i].style && images && images[0]) {
          noImage[i].style.height = images[0].offsetHeight + 'px';
        }
      }

      if (cards) {
        if (!this.global.heightCoverSlider) {
          this.global.heightCoverSlider = [];
        } else {
          if (this.global.heightCoverSlider[this.id]) {
            this.global.heightCoverSlider[this.id] = 0;
          }
        }

        const content_cards =
          element?.getElementsByClassName('content-slide-card');
        const image_cards = element?.getElementsByClassName('image-slide-card');

        for (let c in cards) {
          let cardContentHeight = 0;

          for (let cc in content_cards[c].childNodes) {
            if (
              content_cards[c].childNodes[cc] &&
              content_cards[c].childNodes[cc].style
            ) {
              cardContentHeight += content_cards[c].childNodes[cc].offsetHeight;
            }
          }

          let cardHeight = 0;

          if (image_cards[c] && element?.getElementsByClassName('year-card')[0])
            cardHeight =
              image_cards[c].offsetHeight +
              cardContentHeight +
              element?.getElementsByClassName('year-card')[0].offsetHeight *
                1.5;

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
          if (image_cards[c] && content_cards[c].style) {
            const height_content =
              this.global.heightCoverSlider[this.id] -
              image_cards[c].offsetHeight;
            content_cards[c].style.height = height_content + 'px';
          }
        }
      }
    }, 0);
  }

  ngOnInit() {
    this.id = this.type + this.global.idCoverSlider;
    this.global.idCoverSlider++;

    this.fetchingData();

    this.routerActive.paramMap.subscribe((paramMap) => {
      if (this.route && this.router.url === this.route) {
        this.resize();
        this.platform.resize.subscribe(() => {
          this.resize();
        });
      }
    });

    if (this.data) {
      this.segmentList = this.data;
    }

    setTimeout(() => {
      this.resize();
      if (this.data) this.isLoading = false;
    }, 2000);

    // development mode
    setInterval(() => {
      this.resize();
    }, 1000);
  }

  resize() {
    this.updateSliderIndexes();
    this.adjustSlidesPerView();
    this.fullHeight();
  }

  updateSliderIndexes() {
    this.selectedSegment = Array(this.slideOpts.slidesPerView);
    this.totalSlides = Array(
      Math.ceil(this.segmentList.length / this.slideOpts.slidesPerView)
    );
  }

  adjustSlidesPerView() {
    const element = this.swiperRef?.nativeElement;

    if (!element) return;

    const width = element.clientWidth;

    if (this.desired_width_px) {
      this.slideOpts.slidesPerView = Math.floor(width / this.desired_width_px);
    } else {
      this.slideOpts.slidesPerView = Math.floor(
        width / this.defaultDesireWidth
      );
    }

    if (this.exceptions_width) {
      for (let e in this.exceptions_width) {
        let keys = Object.keys(this.exceptions_width[e]);
        const slides_i = keys.indexOf('slides');
        keys.splice(slides_i, 1);

        if (slides_i !== -1) {
          if (keys.includes('min_width') && keys.includes('max_width')) {
            let str_greater = '';
            let greater = 0;

            for (let k in keys) {
              if (this.exceptions_width[e][keys[k]] > greater) {
                greater = this.exceptions_width[e][keys[k]];
                str_greater = keys[k];
              }
            }

            const str_smaller =
              str_greater === 'min_width' ? 'max_width' : 'min_width';

            if (
              width > this.exceptions_width[e][str_smaller] &&
              width < this.exceptions_width[e][str_greater]
            ) {
              this.slideOpts.slidesPerView = this.exceptions_width[e].slides;
            }
          } else if (keys.includes('min_width')) {
            if (width > this.exceptions_width[e].min_width) {
              this.slideOpts.slidesPerView = this.exceptions_width[e].slides;
            }
          } else if (keys.includes('max_width')) {
            if (width < this.exceptions_width[e].max_width) {
              this.slideOpts.slidesPerView = this.exceptions_width[e].slides;
            }
          } else if (keys.includes('width')) {
            if (width === this.exceptions_width[e].width) {
              this.slideOpts.slidesPerView = this.exceptions_width[e].slides;
            }
          }
        }
      }
    }
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  swiperSlideChanged(e: any) {
    if (this.type !== 'cast') this.resize();
  }

  swiperReachEnd(e: any) {
    this.fetchingData();
  }

  async fetchingData() {
    if (!this.isLoading && (this.is_paginated || this.page === 0) && this.url) {
      this.isLoading = true;

      await fetch(this.url + (this.is_paginated ? `/${this.page}` : ''))
        .then((res) => res.json())
        .then((data) => {
          const media = this.is_paginated ? data.results : data;
          this.isLoading = false;
          this.segmentList = this.segmentList.concat(media);
          this.page++;
          media.forEach(async (item: any) => {
            await fetch(url_api + '/get-age/' + item.id_age)
              .then((res) => {
                if (!res.ok) {
                  throw new Error('Error en la respuesta del servidor');
                }
                return res.json();
              })
              .then((data) => {
                item.age = data;
              });
          });

          setTimeout(() => {
            this.resize();
          }, 500);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  _segmentSelected(index: number) {
    this.swiper?.slideTo(index);
  }
}
