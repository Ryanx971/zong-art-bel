import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ContactService } from 'src/app/services/contact/contact.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {
  constructor(private contactSerice: ContactService, private toastService: ToastService, public navParam: NavParams) {}

  synchronise = () => {
    let popover: PopoverController = this.navParam.get('popover');
    console.log('Popover', this.navParam.get('popover'));
    const SUCCESS_MESSAGE = 'Synchronisation effectuée avec succès';
    this.contactSerice.synchronize().then(
      () => {
        this.toastService.show(SUCCESS_MESSAGE, 'success-toast', 'bottom', 4000);
        popover.dismiss();
      },
      (e) => this.toastService.show(e, 'danger-toast', 'bottom', 4000),
    );
  };
}
