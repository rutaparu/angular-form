import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { FormPageRoutingModule } from './form-page-routing.module';
import { FormPageComponent } from './form-page.component';

@NgModule({
  declarations: [FormPageComponent, GeneralInfoComponent],
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    FormPageRoutingModule,
  ],
  providers: [],
  exports: [FormPageComponent],
})
export class FormPageModule {}
