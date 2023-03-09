import { FeedbackService } from './feedback.service';
import {
  ToastController,
  LoadingController,
  ToastOptions,
} from '@ionic/angular';

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(() => {
    toastControllerSpy = jasmine.createSpyObj('ToastController', [
      'create',
      'present',
    ]);
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
      'create',
      'present',
    ]);
    feedbackService = new FeedbackService(
      toastControllerSpy,
      loadingControllerSpy
    );
  });

  it('should be created', () => {
    expect(feedbackService).toBeTruthy();
  });

  describe('showToast', () => {
    const successType = 'success';
    const warningType = 'warning';
    const dangerType = 'danger';
    const defaultToastOptions: ToastOptions = {
      message: 'Test message',
      duration: 5000,
      position: 'top',
    };

    it('should create and present a toast with the given message and success type', async () => {
      const toastSpy = jasmine.createSpyObj('toast', ['present']);
      toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));

      await feedbackService.showToast('Test message', successType);
      const expectedCall: ToastOptions = {
        ...defaultToastOptions,
        color: successType,
      };

      expect(toastControllerSpy.create).toHaveBeenCalledWith(expectedCall);
      expect(toastSpy.present).toHaveBeenCalled();
    });

    it('should create and present a toast with the given message and warning type', async () => {
      const toastSpy = jasmine.createSpyObj('toast', ['present']);
      toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));

      await feedbackService.showToast('Test message', warningType);
      const expectedCall: ToastOptions = {
        ...defaultToastOptions,
        color: warningType,
      };

      expect(toastControllerSpy.create).toHaveBeenCalledWith(expectedCall);
      expect(toastSpy.present).toHaveBeenCalled();
    });

    it('should create and present a toast with the given message and danger type', async () => {
      const toastSpy = jasmine.createSpyObj('toast', ['present']);
      toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));

      await feedbackService.showToast('Test message', dangerType);
      const expectedCall: ToastOptions = {
        ...defaultToastOptions,
        color: dangerType,
      };

      expect(toastControllerSpy.create).toHaveBeenCalledWith(expectedCall);
      expect(toastSpy.present).toHaveBeenCalled();
    });
  });

  describe('showLoading', () => {
    it('should create and present a loading indicator with the given message', async () => {
      const message = 'test message';
      const loadingSpy = jasmine.createSpyObj('loading', ['present']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loadingSpy));

      const result = await feedbackService.showLoading(message);

      expect(loadingControllerSpy.create).toHaveBeenCalledWith({
        message: message,
      });
      expect(loadingSpy.present).toHaveBeenCalled();
      expect(result).toBe(loadingSpy);
    });
  });
});
