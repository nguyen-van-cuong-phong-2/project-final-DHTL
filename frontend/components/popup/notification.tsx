/* eslint-disable react/display-name */
"use client";
import React, { useEffect } from 'react';
import { notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useMyContext } from '../context/context';


const App: React.FC = React.memo(() => {
  const [api, contextHolder] = notification.useNotification();
  const { contentNotifi, SetContentNotifi } = useMyContext()
  useEffect(() => {
    if (contentNotifi != '') {
      const openNotification = () => {
        api.open({
          message: 'BlueBook thông báo!',
          description: `${contentNotifi}`,
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
      };
      openNotification();

    }
    return () => SetContentNotifi('');
  }, [api, contentNotifi]);

  return <div>
    {contextHolder}
  </div>;
});

export default App;
