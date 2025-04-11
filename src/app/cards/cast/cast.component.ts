import {
  Component,
  Input,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-card-cast',
  templateUrl: './cast.component.html',
  styleUrls: ['./cast.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonCard, IonCardContent, CommonModule],
})
export class CardCastComponent implements OnInit {
  @Input() item?: any;

  constructor() {}

  ngOnInit() {}
}
