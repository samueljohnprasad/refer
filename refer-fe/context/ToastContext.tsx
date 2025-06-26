import React, { createContext, useContext, useState } from 'react';
import Toast, { ToastType } from '../components/common/Toast';

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number, icon?: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<ToastType>('info');
  const [duration, setDuration] = useState<number>(2000);
  const [icon, setIcon] = useState<string | undefined>(undefined);

  const showToast = (
    message: string,
    type: ToastType = 'info',
    duration: number = 2000,
    icon?: string
  ) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setIcon(icon);
    setVisible(true);
  };

  const hideToast = () => {
    setVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        duration={duration}
        onHide={hideToast}
        icon={icon}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
