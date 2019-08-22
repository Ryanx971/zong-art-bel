/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-15T17:21:51+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-15T19:29:52+02:00
 */



import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  title: string = "Paramètres";

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  open(path: string){
    this.router.navigate([path]);
  }
}
