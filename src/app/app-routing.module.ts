/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-14T17:00:40+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-16T20:36:29+02:00
 */



import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'rdv/add', loadChildren: './rdv-add/rdv-add.module#RdvAddPageModule' },
  { path: 'stats', loadChildren: './stats/stats.module#StatsPageModule' },
  { path: 'config', loadChildren: './config/config.module#ConfigPageModule' },
  { path: 'services/manage', loadChildren: './services/services.module#ServicesPageModule' },
  { path: 'customers/manage', loadChildren: './customers/customers.module#CustomersPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
