import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvAddPage } from './rdv-add.page';

describe('RdvAddPage', () => {
  let component: RdvAddPage;
  let fixture: ComponentFixture<RdvAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdvAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdvAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
