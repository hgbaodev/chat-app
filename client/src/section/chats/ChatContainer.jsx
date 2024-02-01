import { Flex, Space } from "antd";
import { ChatHeader } from "./ChatHeader";
import { ChatFooter } from "./ChatFooter";
import { __msg_mock__ } from "~/__mock__";
import { DocMessage, MediaMessage, TextMessage, TimeLine } from "./MessageTypes";
export const ChatContainer = () => {
  return (
    <Flex vertical className="h-full flex-1">
      <ChatHeader />
      <Space
        direction="vertical"
        className="p-4 overflow-y-auto "
        style={{
          height: "calc(100vh - 120px)",
          boxShadow:
            "0px 2px 2px -2px rgba(0,0,0,.2), 0px -2px 2px -2px rgba(0,0,0,.2)",
        }}
      >
        {__msg_mock__.map((msg) => {
          switch (msg.type) {
          case "TEXT":
            return <TextMessage key={msg.id} {...msg} />;
          case "IMAGE":
            return <MediaMessage key={msg.id} {...msg} />;
          case "DOC":
            return <DocMessage key={msg.id} {...msg} />;
          case "TIMELINE":
            return <TimeLine key={msg.id} {...msg} />;
          default:
            return <>123</>;
          }
        })}
      </Space>
      <ChatFooter />
    </Flex>
  );
};
