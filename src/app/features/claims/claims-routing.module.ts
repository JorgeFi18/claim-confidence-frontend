import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimsListComponent } from './claims-list/claims-list.component';
import { ClaimDetailComponent } from './claim-detail/claim-detail.component';
import { ClaimFormComponent } from './claim-form/claim-form.component';

const routes: Routes = [
  {
    path: '',
    component: ClaimsListComponent
  },
  {
    path: 'new',
    component: ClaimFormComponent
  },
  {
    path: ':id',
    component: ClaimDetailComponent
  },
  {
    path: ':id/edit',
    component: ClaimFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }
