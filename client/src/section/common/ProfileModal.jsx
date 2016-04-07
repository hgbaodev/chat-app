import { Avatar, Button, Divider, Flex, Image, Space, Typography } from 'antd';
import { useEffect } from 'react';
import ModalComponent from '~/components/ModalComponent';
import { useDispatch, useSelector } from '~/store';
const { Text, Title } = Typography;

const ProfileModal = () => {
  const { openProfile, info, type } = useSelector((state) => state.contact);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = () => {
      //
    };
    fetch();
  }, [dispatch]);
  const handleClose = () => {
    //
  };
  if (!info) return;
  if (type == 0)
    return (
      <ModalComponent
        open={openProfile}
        title="Account Information"
        onCancel={handleClose}
        footer={null}
        width={450}
        centered
      >
        <Flex vertical>
          <Image
            height={180}
            src="https://res.cloudinary.com/dw3oj3iju/image/upload/v1709748276/chat_app/t0aytyt93yhgj5yb3fce.jpg"
            preview={{ mask: false }}
            className="cursor-pointer"
          />
          <Space
            style={{
              paddingLeft: '14px',
              paddingBottom: '20px',
              borderBottom: '8px solid #edebeb'
            }}
          >
            <Avatar
              style={{
                marginTop: '-40px',
                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: 'white'
              }}
              draggable={true}
              alt="Avatar"
              size={90}
              src={info.avatar}
            />
            <Title level={5} className="mt-2" strong>
              {info.full_name}
            </Title>
          </Space>
          <Space className="px-5 py-4" direction="vertical">
            <Title level={5} strong>
              Personal information
            </Title>
            <ItemInfo label="Bio" value={info.about} />
            <ItemInfo label="Email" value={info.email} />
            <ItemInfo label="Birthday" value={info.birthday} />
            <ItemInfo label="Phone" value={info.phone} />
          </Space>
          <Divider
            style={{
              margin: 0,
              border: '0.5px solid #edebeb'
            }}
          />
        </Flex>
      </ModalComponent>
    );
};

const ItemInfo = ({ label, value }) => {
  return (
    <Space align="start">
      <span className="block w-[100px] text-sm">{label}</span>
      <Text>{value}</Text>
    </Space>
  );
};

export default ProfileModal;
