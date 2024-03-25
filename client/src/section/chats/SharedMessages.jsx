import { faker } from '@faker-js/faker';
import { Button, Col, Flex, Image, Row, Tabs } from 'antd';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showContactInfo } from '~/store/slices/appSlice';
import pdf from '~/assets/pdf_icon.svg';
import { GoDownload } from 'react-icons/go';

export const SharedMessages = () => {
  const dispatch = useDispatch();

  // handle
  const handleReturnContactInfo = () => {
    dispatch(showContactInfo());
  };
  const items = [
    {
      key: '1',
      label: 'Media',
      children: <Media />
    },
    {
      key: '2',
      label: 'Links',
      children: <Links />
    },
    {
      key: '3',
      label: 'Docs',
      children: <Docs />
    }
  ];
  const onChange = (key) => {
    console.log('key', key);
  };

  // render
  return (
    <Flex
      vertical
      className="w-[350px]"
      style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
    >
      <Flex
        gap={10}
        align="center"
        className="w-full h-[60px] px-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
      >
        <Button
          type="text"
          shape="circle"
          icon={<IoArrowBackSharp size={18} />}
          size={20}
          onClick={handleReturnContactInfo}
        />
        <p className="m-0 font-semibold">Shared Messages</p>
      </Flex>

      <Flex className="p-4">
        <Tabs
          centered
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          className="w-full"
        />
      </Flex>
    </Flex>
  );
};

export const Media = () => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={6}>
        <Image src={faker.image.urlLoremFlickr()} />
      </Col>
      <Col span={6}>
        <Image src={faker.image.urlLoremFlickr()} />
      </Col>
      <Col span={6}>
        <Image src={faker.image.urlLoremFlickr()} />
      </Col>
      <Col span={6}>
        <Image src={faker.image.urlLoremFlickr()} />
      </Col>
      <Col span={6}>
        <Image src={faker.image.urlLoremFlickr()} />
      </Col>
      <Col span={6}>
        <Image src={faker.image.urlLoremFlickr()} />
      </Col>
    </Row>
  );
};

export const Links = () => {
  return (
    <Flex vertical className="overflow-y-auto h-[calc(100vh-160px)] scrollbar">
      Links
    </Flex>
  );
};

export const Docs = () => {
  return (
    <Flex vertical className="overflow-y-auto h-[calc(100vh-160px)] scrollbar">
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
      <DocItem />
    </Flex>
  );
};

export const DocItem = () => {
  return (
    <Flex
      align="center"
      justify="space-between"
      className="p-2 w-full hover:bg-blue-50 rounded"
    >
      <Flex align="center" gap={4}>
        <img src={pdf} className="w-[50px] h-[50px]" />
        <div>
          <p className="m-0 font-semibold">{faker.lorem.words()}</p>
          <p className="m-0">32.5 MB</p>
        </div>
      </Flex>
      <Button type="text" shape="circle" icon={<GoDownload size={20} />} />
    </Flex>
  );
};
