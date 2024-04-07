import { Avatar, Flex, Image, Space, Typography, Button } from 'antd';
import { useEffect } from 'react';
import { LuUserPlus } from 'react-icons/lu';
import ModalComponent from '~/components/ModalComponent';
import { useDispatch, useSelector } from '~/store';
import { getProfile } from '~/store/slices/appSlice';
import { setOpenProfile } from '~/store/slices/appSlice';
const { Text, Title } = Typography;

const ProfileModal = () => {
  const { info, id } = useSelector((state) => state.app.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) dispatch(getProfile(id));
  }, [dispatch, id]);

  const handleClose = () => {
    dispatch(setOpenProfile(''));
  };

  return (
    <ModalComponent
      open={id}
      title="Profile"
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
        <Flex
          style={{
            paddingLeft: '14px',
            paddingBottom: '20px',
            borderBottom: '8px solid #edebeb'
          }}
          className="px-3 pb-5 border-b-2 border-t-0 border-x-0 border-solid border-gray-200"
          justify="space-between"
          align="center"
        >
          <Space>
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
              src={info?.avatar}
            />
            <Title level={5} className="mt-2" strong>
              {info?.full_name}
            </Title>
          </Space>

          {!info?.is_friend && (
            <Button type="primary" icon={<LuUserPlus />} shape="circle" />
          )}
        </Flex>
        <Space className="px-5 py-4" direction="vertical">
          <Title level={5} strong>
            Personal information
          </Title>
          {info?.about && <ItemInfo label="Bio" value={info?.about} />}
          {info?.email && <ItemInfo label="Email" value={info?.email} />}
          {info?.birthday && (
            <ItemInfo label="Birthday" value={info?.birthday} />
          )}
          {info?.phone && <ItemInfo label="Phone" value={info?.phone} />}
        </Space>
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
