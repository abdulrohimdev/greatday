import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    redirectTo:'account'
  },
  {
    path:'account',
    loadChildren: ()=> import('./module/user-account/user-account.module').then(m => m.UserAccountModule)
  },
  {
    path:'dashboard',
    loadChildren: ()=> import('./module/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
