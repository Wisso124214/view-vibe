import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { SliderComponent } from '../slider/slider.component';
import { SliderComments } from '../slider-comments/slider-comments.component';
import {
  path_images_500,
  path_images_original,
  url_api,
} from '../../utils/FetchData';

@Component({
  selector: 'app-details-media',
  templateUrl: './details-media.page.html',
  styleUrls: ['./details-media.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonSpinner,
    SliderComponent,
    SliderComments,
  ],
})
export class DetailsMediaPage implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  Math: any = Math;

  global: any = globalThis;
  id: any;
  media: any;
  urlPath: any = 'https://api.themoviedb.org/3/movie/';
  pathImg500: any = path_images_500;
  pathImgOriginal: any = path_images_original;
  heightImage: any;
  options: any = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTE3ZDc0ZTdkOTZjNWI5ZTJkYWRiMGYxMzU2NmI5YSIsIm5iZiI6MTc0MTM5MTQxMS4zMDMsInN1YiI6IjY3Y2I4NjMzYTRkZjk3ZGI5NjRmNjg3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eGIHpPLr1waotJ5nHWUTMIqqt4fKA3JGGkc9lq75wLs',
    },
  };
  runtimeHours: any;
  runtimeMinutes: any;
  enableBack: any = false;
  isLoading: boolean = false;
  hasError: boolean = false;
  genres: any = [];
  releaseDate: any;
  cast: any = [];
  comments: any = [];

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.fetchMediaDetails();
  }

  fetchMediaDetails() {
    this.isLoading = true;
    this.hasError = false;

    // fetch(`${this.urlPath}/${this.id}?language=en-US`, this.options)
    fetch(`${url_api}/movie/${this.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return res.json();
      })
      .then(async (data) => {
        this.media = data;
        if (!this.media) {
          this.hasError = true;
          this.isLoading = false;
          return;
        }

        this.runtimeHours = Math.floor(this.media.runtime / 60);
        this.runtimeMinutes = this.media.runtime % 60;
        this.enableBack = true;
        this.isLoading = false;
        this.releaseDate = new Date(this.media.release_date);
        this.releaseDate = this.releaseDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });

        this.comments = [];

        for (let c in this.media.id_comments) {
          await fetch(url_api + '/get-comment/' + this.media.id_comments[c])
            .then((res) => {
              if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
              }
              return res.json();
            })
            .then((data) => {
              this.comments.push(data);
            })
            .catch((err) => {
              console.error(err);
              this.isLoading = false;
            });
        }

        for (let id_genre of this.media.genres) {
          await fetch(url_api + '/get-genre/' + id_genre)
            .then((res) => {
              if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
              }
              return res.json();
            })
            .then((data) => {
              this.genres.push(data);
            });
        }

        for (let c in this.media.cast) {
          await fetch(url_api + '/get-actor/' + this.media.cast[c])
            .then((res) => {
              if (!res || !res.ok) {
                throw new Error('Error en la respuesta del servidor');
              }
              return res.json();
            })
            .then((data) => {
              this.cast.push(data);
            })
            .catch((err) => {
              console.error(err);
              this.isLoading = false;
            });
        }
      })
      .catch((err) => {
        console.error(err);
        this.hasError = true;
        this.isLoading = false;
      });
  }

  retryFetch() {
    this.fetchMediaDetails();
  }

  goBack() {
    // this.router.navigate(['/']);
    this.global.history.back();
  }

  openHomepage(link: any) {
    window.open(link, '_blank');
  }
}
