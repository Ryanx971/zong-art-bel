import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterPage } from './parameter.page';

describe('ParameterPage', () => {
  let component: ParameterPage;
  let fixture: ComponentFixture<ParameterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
