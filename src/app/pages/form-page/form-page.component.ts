import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  combineLatest,
  filter,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { FormSteps, SpecialistLevel } from './enums/form-page.enums';
import {
  IFormControls,
  IGeneralInfoControls,
} from './models/form-controls.interface';

const NO_A_LETTER_PATTERN = /^[B-Zb-z ]+$/;

const ALPHABET_PATTERN = /^[A-Za-z]+$/;

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPageComponent implements OnInit, OnDestroy {
  activeStep: FormSteps = FormSteps.generalInfo;
  formSteps = FormSteps;
  formGroup: FormGroup<IFormControls>;
  showConfirmationMessage: boolean = false;
  contentToDisplay: { [key: string]: string | number | boolean };
  private destroyed$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder) {}

  get generalInfoControls(): IGeneralInfoControls {
    return this.formGroup.controls.generalInfo.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setSpecialistValueListener();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSubmitStepConfirmClicked(): void {
    if (this.formGroup.controls.generalInfo.value.lookingForWork) {
      this.showConfirmationMessage = true;
    } else {
      this.onStepChangeClicked(FormSteps.motivationalLetter);
      this.showConfirmationMessage = false;
    }
  }

  onStepChangeClicked(activeStep: FormSteps): void {
    this.activeStep = activeStep;
  }

  onFinalSubmission(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.setContentToDisplay();
  }

  private setContentToDisplay(): void {
    const nonEmptyGeneralInfoFields = Object.fromEntries(
      Object.entries(this.formGroup.value.generalInfo).filter(
        ([_, v]) => v != null
      )
    );

    this.contentToDisplay = {
      ...nonEmptyGeneralInfoFields,
      motivationalLetter: this.formGroup.value.motivationalLetter,
    };
  }

  private setSpecialistValueListener(): void {
    combineLatest([
      this.specialistLevelValueChanges(),
      this.lookingForWorkValueChanges(),
    ])
      .pipe(
        filter(([level]) => !!level),
        takeUntil(this.destroyed$)
      )
      .subscribe(([level, lookingForWork]) =>
        this.manageValidatorsAndValues(level, lookingForWork)
      );
  }

  private specialistLevelValueChanges(): Observable<SpecialistLevel> {
    const specialistLevelControl = this.generalInfoControls.specialistLevel;
    return specialistLevelControl.valueChanges.pipe(
      startWith(specialistLevelControl.value)
    );
  }

  private lookingForWorkValueChanges(): Observable<boolean> {
    const lookingForWorkControl = this.generalInfoControls.lookingForWork;
    return lookingForWorkControl.valueChanges.pipe(
      startWith(lookingForWorkControl.value)
    );
  }

  private manageValidatorsAndValues(
    level: SpecialistLevel,
    lookingForWork?: boolean
  ): void {
    if (level === SpecialistLevel.junior) {
      this.generalInfoControls.sumField.setValidators([
        Validators.required,
        Validators.pattern(/4/),
      ]);

      this.resetDescriptionControl();
      this.resetMotivationalLetterControl();
    } else if (level === SpecialistLevel.mid) {
      this.generalInfoControls.description.setValidators([
        Validators.required,
        Validators.pattern(NO_A_LETTER_PATTERN),
      ]);

      this.resetMotivationalLetterControl();
      this.resetSumFieldControl();
    } else {
      this.setMotivationalLetterValidators(lookingForWork);
      this.resetDescriptionControl();
      this.resetSumFieldControl();
    }
  }

  private resetDescriptionControl(): void {
    this.generalInfoControls.description.reset();
    this.generalInfoControls.description.setValidators([]);
    this.generalInfoControls.description.updateValueAndValidity();
  }

  private resetSumFieldControl(): void {
    this.generalInfoControls.sumField.reset();
    this.generalInfoControls.sumField.setValidators([]);
    this.generalInfoControls.sumField.updateValueAndValidity();
  }

  private resetMotivationalLetterControl(): void {
    const letterControl = this.formGroup.controls.motivationalLetter;
    letterControl.reset();
    letterControl.setValidators([]);
    letterControl.updateValueAndValidity();
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group<IFormControls>({
      generalInfo: new FormGroup({
        name: new FormControl('', [
          Validators.required,
          Validators.pattern(ALPHABET_PATTERN),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.pattern(ALPHABET_PATTERN),
        ]),
        email: new FormControl('', Validators.required),
        lookingForWork: new FormControl(true),
        specialistLevel: new FormControl(null, Validators.required),
        sumField: new FormControl(null),
        description: new FormControl(''),
      }),
      motivationalLetter: new FormControl(''),
    });
  }

  private setMotivationalLetterValidators(lookingForWork: boolean): void {
    const validators = !lookingForWork
      ? [Validators.required, Validators.minLength(140)]
      : [];

    this.formGroup.controls.motivationalLetter.setValidators(validators);
  }
}
