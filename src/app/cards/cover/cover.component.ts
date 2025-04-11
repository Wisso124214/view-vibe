import {
  Component,
  Input,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonCard, IonCardContent, CommonModule, ],
})
export class CardCoverComponent implements OnInit {
  @Input() item?: any;

  constructor(private router: Router,) {}

  ngOnInit() {}

  openDetails(id: any) {
    this.router.navigate(['/details-media', id]);
  }
}
