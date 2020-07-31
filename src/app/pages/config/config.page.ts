import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { text } from 'src/app/utils';

interface IConfig {
  open: string;
  icon: string;
  title: string;
}

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  title = text('configPageTitle');

  menu: IConfig[] = [
    {
      title: text('configMenuSyncTitle'),
      open: 'parameters',
      icon: 'settings',
    },
    {
      title: text('configMenuMessageTitle'),
      open: 'message/manage',
      icon: 'settings',
    },
    {
      title: text('configMenuServiceTitle'),
      open: 'services/manage',
      icon: 'settings',
    },
    {
      title: text('configMenuCustomerTitle'),
      open: 'customers/manage',
      icon: 'people',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  open(path: string) {
    this.router.navigate([path]);
  }
}
