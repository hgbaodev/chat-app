import { Avatar, Flex, Space, Typography } from "antd";
import { faker } from "@faker-js/faker";
export const ContactItem = () => {
  return (
    <Flex
      className="bg-white p-2 rounded-md cursor-pointer"
      align="center"
      justify="space-between"
    >
      <Space>
        <Avatar className="bg-[#fde3cf] text-[#f56a00]" >
          {" "}
          {faker.person.fullName()[0].toUpperCase()}
        </Avatar>
        <Flex vertical justify="center">
          <Typography className="text-gray-700 font-bold overflow-hidden whitespace-nowrap text-ellipsis max-w-[120px]">
            {faker.person.fullName()}
          </Typography>
          <Typography className="text-xs text-neutral-500 overflow-hidden whitespace-nowrap text-ellipsis max-w-[120px]">
            {faker.lorem.sentence()}
          </Typography>
        </Flex>
      </Space>
      <Typography className="text-[10px] text-neutral-500">
        {faker.date
          .anytime()
          .toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}
      </Typography>
    </Flex>
  );
};
