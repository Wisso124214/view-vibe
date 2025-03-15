import { Component, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { path_images_500, path_images_original } from '../../utils/FetchData';

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
    IonIcon
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
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTE3ZDc0ZTdkOTZjNWI5ZTJkYWRiMGYxMzU2NmI5YSIsIm5iZiI6MTc0MTM5MTQxMS4zMDMsInN1YiI6IjY3Y2I4NjMzYTRkZjk3ZGI5NjRmNjg3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eGIHpPLr1waotJ5nHWUTMIqqt4fKA3JGGkc9lq75wLs'
    }
  };
  runtimeHours: any;
  runtimeMinutes: any;
  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    fetch(`${this.urlPath}/${this.id}?language=en-US`, this.options)
      .then(res => res.json())
      .then(data => {
        this.media = data;
        this.runtimeHours = Math.floor(this.media.runtime / 60);
        this.runtimeMinutes = this.media.runtime % 60;

        // this.heightImage = document?.getElementsByClassName('backdrop');
        // console.log(this.heightImage)
      })
      .catch(err => console.error(err));
    
    
    

    // this.media = {
    //   "adult": false,
    //   "backdrop_path": "/87GU2ifjNYtgYtcRH1NNH1P4ODo.jpg",
    //   "belongs_to_collection": null,
    //   "budget": 6000000,
    //   "genres": [
    //     {
    //       "id": 18,
    //       "name": "Drama"
    //     },
    //     {
    //       "id": 35,
    //       "name": "Comedy"
    //     },
    //     {
    //       "id": 10749,
    //       "name": "Romance"
    //     }
    //   ],
    //   "homepage": "https://anora.film",
    //   "id": 1064213,
    //   "imdb_id": "tt28607951",
    //   "origin_country": [
    //     "US"
    //   ],
    //   "original_language": "en",
    //   "original_title": "Anora",
    //   "overview": "A young sex worker from Brooklyn gets her chance at a Cinderella story when she meets and impulsively marries the son of an oligarch. Once the news reaches Russia, her fairytale is threatened as his parents set out to get the marriage annulled.",
    //   "popularity": 34.869,
    //   "poster_path": "/qh8m8Udz0sCa5gy9VaqfHPh0yPM.jpg",
    //   "production_companies": [
    //     {
    //       "id": 88152,
    //       "logo_path": "/zm1yRe17jzOgEzXrNj6hd8gl89O.png",
    //       "name": "Cre Film",
    //       "origin_country": "US"
    //     },
    //     {
    //       "id": 7493,
    //       "logo_path": "/fHitYiGUCkRafgt6VPYQlXWLkdp.png",
    //       "name": "FilmNation Entertainment",
    //       "origin_country": "US"
    //     }
    //   ],
    //   "production_countries": [
    //     {
    //       "iso_3166_1": "US",
    //       "name": "United States of America"
    //     }
    //   ],
    //   "release_date": "2024-10-14",
    //   "revenue": 46860968,
    //   "runtime": 139,
    //   "spoken_languages": [
    //     {
    //       "english_name": "Russian",
    //       "iso_639_1": "ru",
    //       "name": "Pусский"
    //     },
    //     {
    //       "english_name": "Armenian",
    //       "iso_639_1": "hy",
    //       "name": ""
    //     },
    //     {
    //       "english_name": "English",
    //       "iso_639_1": "en",
    //       "name": "English"
    //     }
    //   ],
    //   "status": "Released",
    //   "tagline": "Love is a hustle.",
    //   "title": "Anora",
    //   "video": false,
    //   "vote_average": 7.1,
    //   "vote_count": 1666
    // };
  }

  goBack() {
    this.global.history.back();
  }

  openHomepage(link: any) {
    window.open(link, '_blank');
  }
}
