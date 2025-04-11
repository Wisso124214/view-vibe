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
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { IonImg } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { url_api } from 'src/utils/FetchData';

@Component({
  selector: 'app-slider-comments',
  templateUrl: './slider-comments.component.html',
  styleUrls: ['./slider-comments.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    SliderComments,
    RouterOutlet,
    IonImg,
    FormsModule,
  ],
})
export class SliderComments implements OnInit {
  global: any = globalThis;
  @Input() title?: any;
  @Input() data: any = null;
  @Input() id_movie: any;
  charactersCroppedText: number = 200;
  isLoading: boolean = false;
  showPopup: boolean = false;
  newComment: string = '';
  cards: any = [];
  username: any = 'Unknown';
  idEditing: string = '';
  maxLengthComment: number = 10000;
  lengthComment: number = this.newComment?.length;

  @ViewChild('textarea', { static: false }) textarea?: ElementRef;

  constructor(
    private platform: Platform,
    private routerActive: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routerActive.paramMap.subscribe((paramMap) => {
      this.platform.resize.subscribe(() => {
        const width = this.global.innerWidth;

        if (width <= 200) {
          this.charactersCroppedText = 50;
        } else if (width > 200 && width <= 300) {
          this.charactersCroppedText = 100;
        } else if (width > 300 && width <= 700) {
          this.charactersCroppedText = 150;
        } else if (width > 700) {
          this.charactersCroppedText = 250;
        }
      });
    });
  }

  private focusTextArea(value = '') {
    setTimeout(() => {
      if (this.textarea) {
        this.textarea.nativeElement.focus();
        this.textarea.nativeElement.value = value;
        this.lengthComment = value.length;
      } else {
        console.error('Textarea element not found');
      }
    }, 0);
  }

  handleAddComment() {
    this.showPopup = true;
    this.focusTextArea();
  }

  async handleDeleteComment(comment: any) {
    const index = this.data.indexOf(comment);
    if (index > -1) {
      this.data.splice(index, 1);
    }

    await this.updateMovie(
      JSON.stringify({
        id_comments: this.data.map((comment: any) => comment._id),
      })
    );
  }

  handleEditComment(comment: any) {
    this.showPopup = true;
    this.focusTextArea(comment.content);
    this.idEditing = comment._id;
  }

  async addComment() {
    if (this.newComment.trim() === '') return;

    const comment = {
      content: this.newComment,
      username: this.username,
      publish_date: new Date().toISOString(),
      id_comment_replies: [],
      users_liked: [],
    };

    if (this.idEditing === '') {
      await fetch(url_api + '/post-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error en la respuesta del servidor');
          }
          return res.json();
        })
        .then((data) => {
          this.data.unshift(data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      const index = this.data.findIndex(
        (comm: any) => comm._id === this.idEditing
      );
      if (index > -1) {
        this.data[index].content = this.newComment;
      }

      await fetch(url_api + '/update-comment/' + this.idEditing, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error en la respuesta del servidor');
          }
          return res.json();
        })
        .then((data) => {
          this.idEditing = '';
        })
        .catch((err) => {
          console.error(err);
        });
    }

    this.cancelComment();
    const container = document.querySelector('.slide-card-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    await this.updateMovie(
      JSON.stringify({
        id_comments: this.data.map((comment: any) => comment._id),
      })
    );
  }

  async updateMovie(body: any) {
    await fetch(url_api + '/update-movie/' + this.id_movie, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return res.json();
      })
      .catch((err) => {
        console.error(err);
      });

    await fetch(url_api + '/delete-globals-paginations');
  }

  cancelComment() {
    this.newComment = '';
    this.showPopup = false;
    this.lengthComment = 0;
  }

  handleCommentClick(comment: any, e: any) {
    comment.isCropped = !comment.isCropped;
  }

  async toggleCommentFavorite(comment: any) {
    
    if (comment.content.length > this.charactersCroppedText) {
      comment.isCropped = !comment.isCropped;
    }

    if (comment.users_liked.includes(this.username)) {
      const index = comment.users_liked.indexOf(this.username);
      if (index > -1) {
        comment.users_liked.splice(index, 1);
      }
    } else {
      comment.users_liked.push(this.username);
    }

    await fetch(url_api + '/update-comment/' + comment._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return res.json();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
