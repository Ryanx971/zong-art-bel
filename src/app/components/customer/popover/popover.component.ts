import { Component } from '@angular/core';
import { NavParams, PopoverController, LoadingController } from '@ionic/angular';
import { ContactService } from 'src/app/services/contact/contact.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {
  constructor(
    private contactSerice: ContactService,
    private toastService: ToastService,
    public navParam: NavParams,
    public loadingCtrl: LoadingController,
  ) {}

  synchronise = async () => {
    // LOADER
    const loading = await this.loadingCtrl.create({
      message: 'Synchronisation en cours...',
    });
    loading.present();
    let popover: PopoverController = this.navParam.get('popover');
    this.contactSerice
      .synchronize()
      .then(
        (msg: string) => {
          this.toastService.show(msg, 'success-toast', 'bottom', 4000);
          popover.dismiss();
        },
        (e) => this.toastService.show(e, 'danger-toast', 'bottom', 4000),
      )
      .finally(() => loading.dismiss());
  };
}
