import {
  Component,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  Platform,
} from '@ionic/angular/standalone';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
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
  constructor(
    private platform: Platform,
    private router: Router,
    private routerActive: ActivatedRoute
  ) {}

  global: any = globalThis;
  url_api: any = url_api;
  data: any = null;
  isLoading: boolean = false;

  exceptions_width: any = {};
  desired_width_px: any = undefined;
  defaultDesireWidth: number = 200;
  cardsPerRow: number = 2;

  totalRows: any = [];
  cardsRows: any = [];
  heightCoverCards: any = [];

  @ViewChild('grid_cards') grid_cards: ElementRef | undefined;

  ngOnInit() {
    this.fetchData();

    this.routerActive.paramMap.subscribe((paramMap) => {
      this.resize();
      this.platform.resize.subscribe(() => {
        this.resize();
      });
    });

    setInterval(() => {
      this.resize();
    }, 1000);
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
        this.resize();
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  goBack() {
    this.global.history.back();
  }

  resize() {
    this.updateTotalRows();
    this.adjustSlidesPerView();
    this.fullHeight();
  }

  updateTotalRows() {
    if (this.cardsPerRow === Infinity) this.cardsPerRow = 0;
    this.cardsRows = Array(this.cardsPerRow);
    
    if (this.cardsPerRow > 0) this.totalRows = Array(this.data.length / this.cardsPerRow);
    else this.totalRows = Array(this.data.length);
  }

  adjustSlidesPerView() {
    const element = this.grid_cards?.nativeElement;

    if (!element) {
      console.log('Element not found');
      return;
    }

    const width = element.clientWidth;

    if (this.desired_width_px) {
      this.cardsPerRow = Math.floor(width / this.desired_width_px);
    } else {
      this.cardsPerRow = Math.floor(width / this.defaultDesireWidth);
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
              this.cardsPerRow = this.exceptions_width[e].slides;
            }
          } else if (keys.includes('min_width')) {
            if (width > this.exceptions_width[e].min_width) {
              this.cardsPerRow = this.exceptions_width[e].slides;
            }
          } else if (keys.includes('max_width')) {
            if (width < this.exceptions_width[e].max_width) {
              this.cardsPerRow = this.exceptions_width[e].slides;
            }
          } else if (keys.includes('width')) {
            if (width === this.exceptions_width[e].width) {
              this.cardsPerRow = this.exceptions_width[e].slides;
            }
          }
        }
      }
    }
  }

  fullHeight() {
    setTimeout(() => {
      const element = this.grid_cards?.nativeElement;
      const cols = element?.getElementsByTagName('ion-col');

      for (let col in cols) {
        if (cols[col]) {
          console.log(cols[col].getElementsByClassName('slide-card'))

          const cards = cols[col].getElementsByClassName('slide-card');
          const noImage = cols[col].getElementsByClassName('no-image');
          const images: any = cols[col].getElementsByClassName('image-slide-card');
    
          for (let i in noImage) {
            if (noImage[i].style && images && images[0]) {
              noImage[i].style.height = images[0].offsetHeight + 'px';
            }
          }
    
          if (cards) {
            if (this.heightCoverCards[col]) {
              this.heightCoverCards[col] = 0;
            }
    
            const content_cards =
              cols[col].getElementsByClassName('content-slide-card');
            const image_cards = cols[col].getElementsByClassName('image-slide-card');
            
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
    
              if (image_cards[c] && cols[col].getElementsByClassName('year-card')[0])
                cardHeight =
                  image_cards[c].offsetHeight +
                  cardContentHeight +
                  cols[col].getElementsByClassName('year-card')[0].offsetHeight *
                    1.5;
    
              if (cardHeight) {
                if (!this.heightCoverCards[col]) {
                  this.heightCoverCards[col] = cardHeight;
                }
    
                if (this.heightCoverCards[col] < cardHeight) {
                  this.heightCoverCards[col] = cardHeight;
                }
              }
            }
    
            for (let c in cards) {
              if (this.heightCoverCards[col] && cards[c].style) {
                cards[c].style.height =
                  this.heightCoverCards[col] + 'px';
              }
            }
    
            for (let c in content_cards) {
              if (image_cards[c] && content_cards[c].style) {
                const height_content =
                  this.heightCoverCards[col] -
                  image_cards[c].offsetHeight;
                content_cards[c].style.height = height_content + 'px';
              }
            }
          }
        }
      }
    }, 0);
  }
}
