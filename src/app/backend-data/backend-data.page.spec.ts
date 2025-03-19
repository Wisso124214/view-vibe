import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendDataPage } from './backend-data.page';

describe('BackendDataPage', () => {
  let component: BackendDataPage;
  let fixture: ComponentFixture<BackendDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
