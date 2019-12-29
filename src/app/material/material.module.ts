import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatBadgeModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatDividerModule,
  MatGridListModule,
  MatExpansionModule,
  MatCardModule,
  MatTabsModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatDialogModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

const material = [
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatDividerModule,
  MatCardModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatDialogModule
];

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule {}
