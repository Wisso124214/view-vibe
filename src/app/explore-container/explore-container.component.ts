import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class ExploreContainerComponent {
  @Input() name?: string;
}
