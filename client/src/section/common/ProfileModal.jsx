import {
  Avatar,
  Button,
  DatePicker,
  Divider,
  Flex,
  Image,
  Input,
  Space,
  Typography
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoChevronBack } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from '~/components/ModalComponent';
import { getInfoUser, setOpenProfile } from '~/store/slices/contactSlice';

const { Text } = Typography;

const ProfileModal = () => {
  const { openProfile, info } = useSelector((state) => state.contact);
  const [type, setType] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = () => {
      dispatch(getInfoUser());
    };
    fetch();
  }, [dispatch]);
  const handleClose = () => {
    setType(0);
    dispatch(setOpenProfile(false));
  };
  if (!info) return;
  if (type == 0)
    return (
      <ModalComponent
        open={openProfile}
        title="Account Information"
        onCancel={handleClose}
        footer={
          <Flex className="px-[20px] py-[10px]">
            <Button
              type="text"
              size="middle"
              icon={<AiOutlineEdit />}
              className="w-full"
              onClick={() => setType(1)}
            >
              Update Profile
            </Button>
          </Flex>
        }
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
                marginTop: '-20px',
                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: 'white'
              }}
              draggable={true}
              alt="Avatar"
              size={64}
              src={info.avatar}
            />
            <Text strong>{info.full_name}</Text>
          </Space>
          <Space className="px-5 py-4" direction="vertical">
            <Text strong>Information</Text>
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

  if (type == 1) return <UpdateProfile setType={setType} />;
};
import { MdEdit } from 'react-icons/md';

const UpdateProfile = ({ setType }) => {
  const dispatch = useDispatch();
  const { openProfile, info } = useSelector((state) => state.contact);
  const [imageSrc, setImageSrc] = useState(info.avatar);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);
  const handleClose = () => {
    setType(0);
    dispatch(setOpenProfile(false));
  };
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <ModalComponent
      open={openProfile}
      title={
        <Flex className="items-center">
          <Button
            type="text"
            shape="circle"
            icon={<IoChevronBack size="20px" />}
            onClick={() => setType(0)}
            style={{
              marginLeft: '-10px'
            }}
          />
          Update Information
        </Flex>
      }
      onCancel={handleClose}
      BorderHeader={true}
      BorderFooter={true}
      width={450}
      footer={
        <Flex className="px-[20px] py-[10px]" justify="flex-end">
          <Button
            type="text"
            style={{
              marginRight: '10px',
              backgroundColor: '#ebebeb'
            }}
          >
            Cancel
          </Button>
          <Button type="primary">Update</Button>
        </Flex>
      }
      centered
    >
      <Space direction="vertical" className="w-full px-[20px] py-[10px]">
        <Flex justify="center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative"
          >
            <Avatar
              size={80}
              src={imageSrc}
              className={hovered ? 'filter brightness-75' : ''}
            />
            {hovered && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Button
                  type="text"
                  shape="circle"
                  icon={<MdEdit className="text-white" />}
                  onClick={() => fileInputRef.current.click()}
                  size={40}
                />
              </div>
            )}
          </div>
        </Flex>
        <Space size="middle">
          <Space direction="vertical">
            <Text>FirtName</Text>
            <Input value={info.first_name}></Input>
          </Space>
          <Space direction="vertical">
            <Text>LastName</Text>
            <Input value={info.last_name}></Input>
          </Space>
        </Space>
        <Space className="w-full" direction="vertical">
          <Text>Email</Text>
          <Input value={info.email}></Input>
        </Space>
        <Space className="w-full" direction="vertical">
          <Text>Phone</Text>
          <Input value={info.phone}></Input>
        </Space>
        <Space className="w-full" direction="vertical">
          <Text>Birthday</Text>
          <DatePicker className={info.birthday} />
        </Space>
        <Space className="w-full" direction="vertical">
          <Text>About</Text>
          <Input.TextArea
            rows={3}
            value={info.about}
            placeholder="maxLength is 100"
            maxLength={100}
          ></Input.TextArea>
        </Space>
      </Space>
    </ModalComponent>
  );
};

const ItemInfo = ({ label, value }) => {
  return (
    <Space>
      <span className="block w-[100px] text-sm">{label}</span>
      <Text>
        {value || <span className="text-red-300">Chưa điền thông tin</span>}
      </Text>
    </Space>
  );
};

export default ProfileModal;
