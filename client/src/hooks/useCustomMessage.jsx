import { useCallback } from 'react';
import { message } from 'antd';

const useCustomMessage = () => {
  const showMessage = useCallback((type, content) => {
    message[type](content);
  }, []);

  const success = useCallback(
    (content) => {
      showMessage('success', content);
    },
    [showMessage]
  );

  const error = useCallback(
    (content) => {
      showMessage('error', content);
    },
    [showMessage]
  );

  const warning = useCallback(
    (content) => {
      showMessage('warning', content);
    },
    [showMessage]
  );

  return { success, error, warning };
};

export default useCustomMessage;
