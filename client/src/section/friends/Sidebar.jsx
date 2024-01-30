import { Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';
const NAV_TITLE = ['Friends', 'Groups', 'Friend Requests'];
export const Sidebar = () => {
  const [selected, setSelected] = useState(0);

  // handle
  const handleClickContact = (index) => {
    // logic here

    setSelected(index);
  };

  // render
  return (
    <>
      <Title level={4} className="m-0">
        Contacts
      </Title>

      <Space direction="vertical" className="w-full my-4 h-[590px] overflow-y-auto scrollbar">
        {NAV_TITLE.map((item, index) => (
          <div
            key={index}
            className={`bg-white p-4 cursor-pointer font-semibold rounded ${
              selected === index && 'bg-blue-600 text-white'
            }`}
            onClick={() => {
              handleClickContact(index);
            }}
          >
            {item}
          </div>
        ))}
      </Space>
    </>
  );
};
