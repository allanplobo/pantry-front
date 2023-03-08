import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

type ToastColors = 'success' | 'warning' | 'danger';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private toastController: ToastController) {}

  async showToast(message: string, type: ToastColors): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      color: type,
    });

    await toast.present();
  }
}
