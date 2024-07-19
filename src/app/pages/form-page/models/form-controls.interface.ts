import { FormControl, FormGroup } from '@angular/forms';
import { SpecialistLevel } from '../enums/form-page.enums';

export interface IFormControls {
  generalInfo: FormGroup<IGeneralInfoControls>;
  motivationalLetter: FormControl<string>;
}

export interface IGeneralInfoControls {
  name: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  lookingForWork: FormControl<boolean>;
  specialistLevel: FormControl<SpecialistLevel>;
  sumField: FormControl<number>;
  description: FormControl<string>;
}
