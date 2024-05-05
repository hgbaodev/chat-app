import { Avatar, Button, Flex, Space } from 'antd';
import { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import {
  IoMicOffOutline,
  IoMicOutline,
  IoVideocamOffOutline,
  IoVideocamOutline,
  IoClose,
  IoEllipsisVerticalSharp
} from 'react-icons/io5';
import { useSelector } from 'react-redux';
import AvatarGroup from '~/components/AvatarGroup';

import { CallTypes, ConversationTypes } from '~/utils/enum';
import { formatSeconds } from '~/utils/formatDayTime';
const VideoCall = ({
  stream,
  remoteStreams,
  videoRef,
  videoRefs,
  duration,
  gridLayout,
  handleCloseCall,
  handleLeaveCall,
  handleRecall
}) => {
  const { call } = useSelector((state) => state.chat);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showMembers, setShowMembers] = useState(false);

  // handle toggle microphone
  const toggleMicrophone = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicrophoneOn(!isMicrophoneOn);
    }
  };
  // handle toggle camera
  const toggleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  return (
    <Flex
      align="center"
      className="w-[100vw] h-[100vh]  bg-[#202124] flex-col text-white"
    >
      <Flex
        align="center"
        justify="center"
        className="flex-1 w-full h-[calc(100%-74px)]"
      >
        {call.refused ? (
          <p>{call.conversation?.title} has refused this call.</p>
        ) : call.ended ? (
          <p>This call has ended.</p>
        ) : (
          <>
            {gridLayout < 2 || call.type == CallTypes.AUDIO ? (
              <Flex
                id="video-frame"
                className={`relative w-full h-full max-h-full gap-4 p-4 grid overflow-auto ${
                  remoteStreams.length === 0
                    ? 'grid-cols-1 grid-rows-1'
                    : remoteStreams.length === 1
                    ? 'grid-cols-2 grid-rows-1'
                    : `grid-cols-${gridLayout} grid-rows-${gridLayout}`
                }`}
              >
                <VideoFrame name="You" videoRef={videoRef} />
                {remoteStreams.map((stream, index) => {
                  const member = call.members.find(
                    (member) => member.peer_id === stream.peer_id
                  );
                  return (
                    <VideoFrame
                      key={index}
                      name={member?.name}
                      videoRef={videoRefs[index]}
                    />
                  );
                })}
              </Flex>
            ) : (
              <Flex
                id="video-frame"
                className={`relative w-full h-full max-h-full gap-4 p-4 flex-wrap`}
                justify="space-between"
              >
                <VideoFrame
                  name="You"
                  videoRef={videoRef}
                  responsive={true}
                  isMuted={true}
                />
                {remoteStreams.map((stream, index) => {
                  const member = call.members.find(
                    (member) => member.peer_id === stream.peer_id
                  );
                  return (
                    <VideoFrame
                      key={index}
                      name={member?.name}
                      videoRef={videoRefs[index]}
                      responsive={true}
                    />
                  );
                })}
              </Flex>
            )}

            {showMembers && <MembersList members={call.members} />}
          </>
        )}
      </Flex>

      <Flex justify="space-between" className="bg-[#3c4043] w-full p-3">
        <Flex align="center" className="w-[30%]">
          {call.conversation.type === ConversationTypes.FRIEND ? (
            <Avatar size={40} src={call.conversation?.image} />
          ) : (
            <AvatarGroup size={40} users={call?.members} />
          )}

          <h2 className="ml-2 my-3 text-[14px] font-semibold">
            {call.conversation?.title}
          </h2>
        </Flex>
        {call.refused || call.ended ? (
          <Space size={50} className="flex-1 justify-center">
            <Button
              type="default"
              shape="circle"
              icon={<IoClose size={22} />}
              size={'large'}
              className="bg-red-500 text-white border-none "
              onClick={handleCloseCall}
            />
            <Button
              type="default"
              shape="circle"
              icon={<FaPhoneAlt size={18} />}
              size={'large'}
              className="bg-green-500 text-white border-none "
              onClick={handleRecall}
            />
          </Space>
        ) : (
          <Space size={23} className="flex-1 justify-center">
            <Button
              type="default"
              shape="circle"
              icon={
                isCameraOn ? (
                  <IoVideocamOutline size={24} />
                ) : (
                  <IoVideocamOffOutline size={24} />
                )
              }
              size={'large'}
              onClick={toggleCamera}
            />
            <Button
              type="default"
              shape="circle"
              icon={
                isMicrophoneOn ? (
                  <IoMicOutline size={24} />
                ) : (
                  <IoMicOffOutline size={24} />
                )
              }
              size={'large'}
              onClick={toggleMicrophone}
            />
            <Button
              type="default"
              shape="circle"
              icon={<FaPhoneAlt size={18} />}
              size={'large'}
              className="bg-red-500 text-white border-none "
              onClick={handleLeaveCall}
            />
          </Space>
        )}
        <Flex justify="end" align="center" className="w-[30%]">
          <p className="me-4">{formatSeconds(duration)}</p>
          <Button
            type="default"
            shape="circle"
            icon={<IoEllipsisVerticalSharp size={20} />}
            size={'large'}
            onClick={() => {
              setShowMembers(!showMembers);
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

const VideoFrame = ({ name, videoRef, isMuted, responsive }) => {
  return (
    <Flex
      align="center"
      justify="center"
      className={`relative bg-[#3c4043] p-2 ${
        responsive ? 'w-[48%] h-[48%]' : ''
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted && 'muted'}
        className="w-full max-w-full max-h-full"
      />
      <div className="bg-[#202124] absolute bottom-[10px] left-[10px] px-2 py-1 rounded">
        {name}
      </div>
    </Flex>
  );
};
const MembersList = ({ members }) => {
  return (
    <div className="h-full w-[30%] bg-[#202124] py-4 pe-4">
      <Flex vertical className="h-full bg-[#3c4043] p-2">
        <p>Members</p>
        <Flex vertical className="gap-3 py-4">
          {members.map((member) => {
            return (
              <>
                <MemberItem avatar={member?.avatar} name={member?.name} />
              </>
            );
          })}
        </Flex>
      </Flex>
    </div>
  );
};
const MemberItem = ({ avatar, name }) => {
  return (
    <Flex align="center" className="w-full gap-2">
      <Avatar size={36} src={avatar} />
      <p>{name}</p>
    </Flex>
  );
};
export default VideoCall;
