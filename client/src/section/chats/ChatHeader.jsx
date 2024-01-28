import { Avatar, Button, Flex, Space, Typography } from 'antd';
import { VideoCameraOutlined, SearchOutlined, ExclamationCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import { useDispatch, useSelector } from 'react-redux';
import { toggleContactInfo } from '~/store/slices/appSlice';
export const ChatHeader = () => {
  const dispatch = useDispatch();
  const { contactInfo } = useSelector((state) => state.app);
  // handle
  const handleOpenContactInfo = () => {
    dispatch(toggleContactInfo());
  };
  return (
    <Flex className="h-[60px] px-4" justify="space-between">
      <Space>
        <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>
          {faker.person.fullName()[0].toUpperCase()}
        </Avatar>
        <Flex vertical justify="center">
          <Typography className="font-bold">{faker.person.fullName()}</Typography>
          <Typography>Online</Typography>
        </Flex>
      </Space>
      <Space size={18}>
        <Button type="text" shape="circle" icon={<VideoCameraOutlined />} size={20} />
        <Button type="text" shape="circle" icon={<PhoneOutlined />} size={20} />
        <Button type="text" shape="circle" icon={<SearchOutlined />} size={20} />
        {!contactInfo.open && (
          <Button
            type="text"
            shape="circle"
            icon={<ExclamationCircleOutlined />}
            size={20}
            onClick={handleOpenContactInfo}
          />
        )}
      </Space>
    </Flex>
  );
};
