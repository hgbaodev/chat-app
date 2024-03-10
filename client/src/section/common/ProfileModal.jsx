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
import { useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoChevronBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import ModalComponent from '~/components/ModalComponent';
import { getInfoUser } from '~/store/slices/authSlice';

const { Text } = Typography;

const ProfileModal = ({ open, setOpen }) => {
  const [type, setType] = useState(0);
  const dispatch = useDispatch()
  useEffect(() => {
    const fetch = () => {
      dispatch(getInfoUser())
    }
    fetch()
  })
  const handleClose = () => {
    setType(0);
    setOpen(false);
  };
  if (type == 0)
    return (
      <ModalComponent
        open={open}
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
              Edit
            </Button>
          </Flex>
        }
        width={450}
      >
        <Flex vertical>
          <Image
            height={150}
            src="https://res.cloudinary.com/dw3oj3iju/image/upload/v1709748276/chat_app/t0aytyt93yhgj5yb3fce.jpg"
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
              src="https://res.cloudinary.com/dw3oj3iju/image/upload/v1709749732/chat_app/b1rj7epnhdqo6t7mcu5w.jpg"
            />
            <Text strong>Hoàng Gia Bảo</Text>
            <Button
              type="text"
              style={{
                border: 0
              }}
              shape="circle"
              icon={<AiOutlineEdit />}
            />
          </Space>
          <Space className="px-[20px] py-[14px]" direction="vertical">
            <Text strong>Information</Text>
            <ItemInfo label="Bio" value="https://github.com/hgbaodev" />
            <ItemInfo label="Email" value="hgbaodev@gmail.com" />
            <ItemInfo label="Birthday" value="01/01/2003" />
            <ItemInfo label="Phone" value="0355374322" />
            <Divider
              style={{
                margin: 0,
                border: '0.5px solid #edebeb'
              }}
            />
          </Space>
        </Flex>
      </ModalComponent>
    );


  if (type == 1)
    return (
      <ModalComponent
        open={open}
        title={
          <Flex>
            <Button
              type="text"
              shape="circle"
              icon={<IoChevronBack size="20px" />}
              onClick={() => setType(0)}
              style={{
                marginTop: '-4px',
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
      >
        <Space direction="vertical" className="w-full px-[20px] py-[10px]">
          <Flex justify="center">
            <Avatar
              size={80}
              src="https://res.cloudinary.com/dw3oj3iju/image/upload/v1709749732/chat_app/b1rj7epnhdqo6t7mcu5w.jpg"
            />
          </Flex>
          <Space size='middle'>
            <Space direction="vertical">
              <Text>FirtName</Text>
              <Input value="Hoàng Gia"></Input>
            </Space>
            <Space direction="vertical">
              <Text>LastName</Text>
              <Input value="Bảo"></Input>
            </Space>
          </Space>
          <Space className="w-full" direction="vertical">
            <Text>Email</Text>
            <Input value="hgbaodev@gmail.com"></Input>
          </Space>
          <Space className="w-full" direction="vertical">
            <Text>Phone</Text>
            <Input value="0355374322"></Input>
          </Space>
          <Space className="w-full" direction="vertical">
            <Text>Birthday</Text>
            <DatePicker className="w-full" />
          </Space>
          <Space className="w-full" direction="vertical">
            <Text>About</Text>
            <Input.TextArea
              rows={3}
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
      <span
        style={{
          display: 'block',
          width: '100px'
        }}
      >
        {label}:
      </span>
      <Text>{value}</Text>
    </Space>
  );
};

export default ProfileModal;
