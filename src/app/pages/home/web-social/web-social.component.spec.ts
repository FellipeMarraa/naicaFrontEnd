import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSocialComponent } from './web-social.component';

describe('WebSocialComponent', () => {
  let component: WebSocialComponent;
  let fixture: ComponentFixture<WebSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebSocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
