import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IGeneralInfoControls } from '../../models/form-controls.interface';
import { FormSteps, SpecialistLevel } from '../../enums/form-page.enums';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoComponent {
  @Input() formGroup: FormGroup<IGeneralInfoControls>;

  @Output() nextClicked: EventEmitter<FormSteps.submitApplication> =
    new EventEmitter<FormSteps.submitApplication>();

  specialistLevelsDropdown = Object.values(SpecialistLevel);
  specialistLevel = SpecialistLevel;

  onNextClicked() {
    this.nextClicked.emit(FormSteps.submitApplication);
  }

  trackByLevel(index: number, level: SpecialistLevel) {
    return level;
  }
}
