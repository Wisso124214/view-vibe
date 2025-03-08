import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsMediaPage } from './details-media.page';

describe('DetailsMediaPage', () => {
  let component: DetailsMediaPage;
  let fixture: ComponentFixture<DetailsMediaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
