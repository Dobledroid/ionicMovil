import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OptionsPopoverComponent } from './options-popover.component';

describe('OptionsPopoverComponent', () => {
  let component: OptionsPopoverComponent;
  let fixture: ComponentFixture<OptionsPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), OptionsPopoverComponent] // Mueve OptionsPopoverComponent a imports
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
