import { TestBed, inject } from '@angular/core/testing';
import { ToastController, ToastOptions } from '@ionic/angular';
import { FeedbackService } from './feedback.service';

type ToastColors = 'success' | 'warning' | 'danger';

describe('FeedbackService', () => {
  let toastController: ToastController;
  let feedbackService: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastController, FeedbackService],
    });
    toastController = TestBed.inject(ToastController);
    feedbackService = TestBed.inject(FeedbackService);
  });

  it('should create the service', inject(
    [FeedbackService],
    (service: FeedbackService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('showToast', () => {
    const message = 'Test message';
    const successType: ToastColors = 'success';
    const warningType: ToastColors = 'warning';
    const dangerType: ToastColors = 'danger';
    const defaultToastOptions: ToastOptions = {
      duration: 5000,
      position: 'top',
      color: 'danger',
    };

    it('should create a success toast', async () => {
      const toastSpy = spyOn(toastController, 'create').and.callThrough();
      await feedbackService.showToast(message, successType);
      const expectedCall: ToastOptions = {
        ...defaultToastOptions,
        message: message,
        color: successType,
      };

      expect(toastSpy).toHaveBeenCalledWith(expectedCall);
    });

    it('should create a warning toast', async () => {
      const toastSpy = spyOn(toastController, 'create').and.callThrough();
      await feedbackService.showToast(message, warningType);
      const expectedCall: ToastOptions = {
        ...defaultToastOptions,
        message: message,
        color: warningType,
      };

      expect(toastSpy).toHaveBeenCalledWith(expectedCall);
    });

    it('should create a danger toast', async () => {
      const toastSpy = spyOn(toastController, 'create').and.callThrough();
      await feedbackService.showToast(message, dangerType);
      const expectedCall: ToastOptions = {
        ...defaultToastOptions,
        message: message,
        color: dangerType,
      };

      expect(toastSpy).toHaveBeenCalledWith(expectedCall);
    });
  });
});
