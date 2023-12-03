/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import { notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
interface AppProps {
  content: string;
}

const App: React.FC<AppProps> = React.memo(({ content }) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const openNotification = () => {
      api.open({
        message: 'BlueBook thông báo!',
        description: `${content}`,
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    };

    openNotification();
  }, [api, content]);

  return <>{contextHolder}</>;
});

export default App;
