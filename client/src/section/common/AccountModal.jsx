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
import { useSelector } from 'react-redux';
import ModalComponent from '~/components/ModalComponent';
import { MdEdit } from 'react-icons/md';
import {
  getInfoUser,
  setOpenMyProfile,
  setType,
  uploadProfile
} from '~/store/slices/contactSlice';
import { useDispatch } from '~/store';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const AccountModal = () => {
  const dispatch = useDispatch();
  const { openProfile, type, info } = useSelector((state) => state.contact);

  const handleClose = () => {
    dispatch(setType(0));
    dispatch(setOpenMyProfile(false));
  };

  if (!info) return null;

  return (
    <ModalComponent
      open={openProfile}
      title={
        type == 1 ? (
          <Flex className="items-center">
            <Button
              type="text"
              shape="circle"
              icon={<IoChevronBack size="20px" />}
              onClick={() => dispatch(setType(0))}
              style={{
                marginLeft: '-10px'
              }}
            />
            Update Information
          </Flex>
        ) : (
          'Account Information'
        )
      }
      onCancel={handleClose}
      footer={null}
      width={450}
      centered
    >
      {type == 0 ? (
        <AccountInfo />
      ) : (
        <UpdateProfile handleClose={handleClose} />
      )}
    </ModalComponent>
  );
};

const AccountInfo = () => {
  const dispatch = useDispatch();
  const { info } = useSelector((state) => state.contact);

  useEffect(() => {
    const fetch = () => {
      dispatch(getInfoUser());
    };
    fetch();
  }, [dispatch]);

  return (
    <>
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
            src={info?.avatar}
          />
          <Title level={5} className="mt-2" strong>
            {info.full_name}
          </Title>
        </Space>
        <Space className="px-5 py-4" direction="vertical">
          <Title level={5} strong>
            Personal information
          </Title>
          {info.about && <ItemInfo label="Bio" value={info.about} />}
          {info.email && <ItemInfo label="Email" value={info.email} />}
          {info.phone && <ItemInfo label="Birthday" value={info.phone} />}
          {info.birthday && <ItemInfo label="Phone" value={info.birthday} />}
        </Space>
        <Divider
          style={{
            margin: 0,
            border: '0.5px solid #edebeb'
          }}
        />
      </Flex>
      <Flex className="px-[20px] py-[10px]">
        <Button
          type="text"
          size="middle"
          icon={<AiOutlineEdit />}
          className="w-full"
          onClick={() => dispatch(setType(1))}
        >
          Update Profile
        </Button>
      </Flex>
    </>
  );
};

const UpdateProfile = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { info, isLoadingUploadProfile } = useSelector(
    (state) => state.contact
  );
  const [imageSrc, setImageSrc] = useState(info.avatar);
  const [imageFile, setImageFile] = useState(null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values) => {
    values.birthday = values?.birthday.format('YYYY-MM-DD');
    if (imageFile != null) values['image'] = imageFile;
    dispatch(uploadProfile(values));
  };

  return (
    <Form
      onFinish={handleSubmit}
      initialValues={{
        first_name: info.first_name,
        last_name: info.last_name,
        email: info.email,
        phone: info.phone,
        birthday: dayjs(info.birthday, 'YYYY-MM-DD'),
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
          <Space>
            <Form.Item
              name="first_name"
              label="First name"
              rules={[
                { required: true, message: 'Please input your first name!' }
              ]}
            >
              <Input placeholder="Nhat" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last name"
              rules={[
                { required: true, message: 'Please input your last name!' }
              ]}
            >
              <Input placeholder="Sinh" />
            </Form.Item>
          </Space>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
            label="Email"
          >
            <Input placeholder="abc@domain.com" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: false, message: 'Please input your phone number!' }
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Birthday"
            rules={[
              { required: true, message: 'Please choose your birthday!' }
            ]}
          >
            <DatePicker
              className="w-full"
              placeholder="Enter your phone birthday"
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item name="about" label="About" rules={[{ required: false }]}>
            <Input.TextArea rows={3} placeholder="About" maxLength={255} />
          </Form.Item>
          <Form.Item>
            <Flex justify="end">
              <Button onClick={handleClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoadingUploadProfile}
              >
                Update
              </Button>
            </Flex>
          </Form.Item>
        </div>
      </Space>
    </Form>
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

export default AccountModal;
