import {
  Avatar,
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
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

const { Text, Title } = Typography;

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

  if (type == 1) return <UpdateProfile setType={setType} />;
};
import { MdEdit } from 'react-icons/md';

const UpdateProfile = ({ setType }) => {
  const dispatch = useDispatch();
  const { openProfile, info } = useSelector((state) => state.contact);
  const [imageSrc, setImageSrc] = useState(info.avatar);
  const [imageFile, setImageFile] = useState(null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setType(0);
    dispatch(setOpenProfile(false));
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values) => {
    if (imageFile != null) values['image'] = imageFile;
    console.log('Form values:', values);
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
      width={450}
      centered
      footer={null}
    >
      <Form
        onFinish={handleSubmit}
        initialValues={{
          first_name: info.first_name,
          last_name: info.last_name,
          email: info.email,
          phone: info.phone,
          birthday: info.birthday,
          about: info.about
        }}
        layout="vertical"
        className="w-full"
        requiredMark="optional"
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
          <div className="form-items-wrapper">
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[
                { required: true, message: 'Please input your first name!' }
              ]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                { required: true, message: 'Please input your last name!' }
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              label="Email"
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { required: true, message: 'Please input your phone number!' }
              ]}
            >
              <Input placeholder="Phone" />
            </Form.Item>
            <Form.Item
              name="birthday"
              label="Birthday"
              rules={[
                { required: true, message: 'Please choose your birthday!' }
              ]}
            >
              <DatePicker className="w-full" placeholder="Birthday" />
            </Form.Item>
            <Form.Item name="about" label="About" rules={[{ required: false }]}>
              <Input.TextArea rows={3} placeholder="About" maxLength={100} />
            </Form.Item>
            <Form.Item>
              <Flex justify="end">
                <Button onClick={handleClose} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Flex>
            </Form.Item>
          </div>
        </Space>
      </Form>
    </ModalComponent>
  );
};

const ItemInfo = ({ label, value }) => {
  return (
    <Space align="start">
      <span className="block w-[100px] text-sm">{label}</span>
      <Text>
        {value || <span className="text-red-300">Chưa điền thông tin</span>}
      </Text>
    </Space>
  );
};

export default ProfileModal;
