import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

type ToastColors = 'success' | 'warning' | 'danger';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async showToast(message: string, type: ToastColors): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      color: type,
    });

    await toast.present();
  }

  async showLoading(message: string): Promise<HTMLIonLoadingElement> {
    const load = await this.loadingController.create({
      message: message,
    });
    load.present();
    return load;
  }
}
