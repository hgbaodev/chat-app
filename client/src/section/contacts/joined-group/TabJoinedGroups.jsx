import { Flex } from "antd";
import { IoPeopleOutline } from "react-icons/io5";

const TabJoinedGroups = () => {
  return (
    <>
      <Flex
        align="center"
        gap={10}
        className="h-[60px] p-4"
        style={{ boxShadow: "0px 0px 2px rgba(0,0,0,.2)" }}
      >
        <IoPeopleOutline size={22} />
        <p className="font-semibold">Joined Groups</p>
      </Flex>
    </>
  );
};

export default TabJoinedGroups;
