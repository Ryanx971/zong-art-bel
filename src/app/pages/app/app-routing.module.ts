import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../home/home.module').then((m) => m.HomePageModule) },
  { path: 'rdv/add', loadChildren: '../rdv-add/rdv-add.module#RdvAddPageModule' },
  { path: 'stats', loadChildren: '../stats/stats.module#StatsPageModule' },
  { path: 'config', loadChildren: '../config/config.module#ConfigPageModule' },
  { path: 'services/manage', loadChildren: '../service/service.module#ServicePageModule' },
  { path: 'customers/manage', loadChildren: '../customers/customers.module#CustomersPageModule' },
  { path: 'parameters', loadChildren: '../parameter/parameter.module#ParameterPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
