import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimsListComponent } from './claims-list/claims-list.component';
import { ClaimDetailComponent } from './claim-detail/claim-detail.component';
import { ClaimFormComponent } from './claim-form/claim-form.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClaimsRoutingModule,
    ReactiveFormsModule,
    ClaimsListComponent,
    ClaimDetailComponent,
    ClaimFormComponent
  ]
})
export class ClaimsModule { }
