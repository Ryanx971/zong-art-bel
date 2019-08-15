/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-14T17:00:40+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-14T18:03:13+02:00
 */



import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RdvAddPage } from './rdv-add.page';

const routes: Routes = [
  {
    path: '',
    component: RdvAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RdvAddPage]
})
export class RdvAddPageModule {}
