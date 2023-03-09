import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NotFoundPage } from './not-found.page';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('NotFoundPage', () => {
  let component: NotFoundPage;
  let fixture: ComponentFixture<NotFoundPage>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NotFoundPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to pantry page when click on button', () => {
    const expectedValue = jasmine.stringMatching(/tabs\/pantry/);
    const routerSpy = spyOn(router, 'navigateByUrl').and.callThrough();
    const buttonToBackToPantryPage =
      fixture.nativeElement.getElementsByTagName('ion-button')[0];
    buttonToBackToPantryPage.click();
    fixture.detectChanges();

    expect(routerSpy).toHaveBeenCalledWith(expectedValue, {});
  });
});
