import { toast, type ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: Partial<ToastOptions> = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notify = {
  success: (message: string, options?: Partial<ToastOptions>) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: Partial<ToastOptions>) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: string, options?: Partial<ToastOptions>) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: string, options?: Partial<ToastOptions>) => {
    toast.warning(message, { ...defaultOptions, ...options });
  }
};