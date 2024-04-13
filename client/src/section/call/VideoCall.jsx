import { Avatar, Button, Flex, Space } from 'antd';

import Peer from 'peerjs';
import React, { useContext, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdPushPin } from 'react-icons/md';
import {
  IoMicOffOutline,
  IoMicOutline,
  IoVideocamOffOutline,
  IoVideocamOutline,
  IoClose,
  IoEllipsisVerticalSharp
} from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import AvatarGroup from '~/components/AvatarGroup';
import { SocketContext } from '~/contexts/socketContext';
import { useSocket } from '~/hooks/useSocket';
import { useDispatch, useSelector } from '~/store';
import { setCall } from '~/store/slices/chatSlice';
import { ConversationTypes } from '~/utils/enum';
import { formatSeconds } from '~/utils/formatDayTime';
const VideoCall = () => {
  const { socketInstance } = useContext(SocketContext);
  const dispatch = useDispatch();
  const { peer_id } = useParams();
  const { call } = useSelector((state) => state.chat);
  const {
    emitGetPeerIds,
    emitLeaveVideoCall,
    emitCancelVideoCall,
    emitEndVideoCall,
    emitVideoCall
  } = useSocket();
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const videoRef = useRef(null);
  const [peer, setPeer] = useState();
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const videoRefs = remoteStreams.map(() => React.createRef());
  const [duration, setDuration] = useState(0);
  const [showMembers, setShowMembers] = useState(false);

  const initPeer = useCallback(() => {
    let params = new URLSearchParams(window.location.search);
    let conversation_id = params.get('conversation_id');
    if (socketInstance) {
      const peerInstance = new Peer(peer_id);
      emitGetPeerIds({ conversation_id });
      if (peer) peer.destroy();
      setPeer(peerInstance);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          setStream(localStream);
          // on call
          peerInstance.on('call', (call) => {
            call.answer(localStream);
            call.on('stream', (remoteStream) => {
              setRemoteStreams((prevStreams) => {
                const streamExists = prevStreams.some(
                  (stream) => stream.peer_id === call.peer
                );
                if (streamExists) {
                  return prevStreams.map((stream) =>
                    stream.peer_id === call.peer
                      ? { peer_id: call.peer, stream: remoteStream }
                      : stream
                  );
                } else {
                  return [
                    ...prevStreams,
                    { peer_id: call.peer, stream: remoteStream }
                  ];
                }
              });
            });
          });
        })
        .catch((err) => {
          console.error('Failed to get local stream', err);
        });
      return () => {
        if (peerInstance) {
          peerInstance.destroy();
        }
      };
    }
  }, [socketInstance]);
  useEffect(() => {
    initPeer();
  }, [socketInstance]);

  useEffect(() => {
    if (peer && call.calling && stream) {
      peer.on('open', (my_peer_id) => {
        try {
          call.members.forEach((member) => {
            if (member.peer_id !== my_peer_id) {
              const myCall = peer.call(member.peer_id, stream);
              myCall.on('stream', (remoteStream) => {
                setRemoteStreams((prevStreams) => {
                  const streamExists = prevStreams.some(
                    (stream) => stream.peer_id === myCall.peer
                  );
                  if (streamExists) {
                    return prevStreams.map((stream) =>
                      stream.peer_id === myCall.peer
                        ? { peer_id: myCall.peer, stream: remoteStream }
                        : stream
                    );
                  } else {
                    return [
                      ...prevStreams,
                      { peer_id: myCall.peer, stream: remoteStream }
                    ];
                  }
                });
              });
              return () => {
                myCall.close();
              };
            }
          });
        } catch (error) {
          console.log('Error occurred:', error);
        }
      });
    }
  }, [peer, stream, call]);

  // on call time running
  useEffect(() => {
    let timer;
    if (call.calling) {
      timer = setInterval(() => {
        setDuration((pre) => pre + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [call.calling]);

  // on listener peer_ids change
  useEffect(() => {
    // serialize peer_ids
    const peer_ids = call.members.map((member) => member.peer_id);
    console.log('peer_ids', peer_ids);
    setRemoteStreams((preStream) =>
      preStream.filter((stream) => peer_ids.includes(stream.peer_id))
    );
  }, [call.members]);

  // set stream to video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // set remote video stream
  useEffect(() => {
    remoteStreams.forEach((stream, index) => {
      const videoEl = videoRefs[index].current;
      if (videoEl && videoEl.srcObject !== stream.stream) {
        videoEl.srcObject = stream.stream;
      }
    });
  }, [remoteStreams, videoRefs]);

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

  const stopStreamAndDestroyPeer = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setStream(null);
    peer.destroy();
  };
  // handle interrupt call
  const handleLeaveCall = useCallback(() => {
    const confirm = window.confirm('Are you sure you want to leave this call?');
    if (!confirm) return;
    if (call.calling) {
      // emit leave call
      emitLeaveVideoCall({
        conversation_id: call.conversation.conversation_id,
        peer_id: peer_id
      });
      if (
        remoteStreams.length === 0 ||
        call.conversation.type == ConversationTypes.FRIEND
      ) {
        // end call if no remote stream or friend call
        emitEndVideoCall({
          conversation_id: call.conversation.conversation_id,
          duration: duration
        });
      } else {
        // close window if group call
        window.close();
      }
    } else {
      console.log('Cancel call');
      emitCancelVideoCall({
        conversation_id: call.conversation.conversation_id
      });
    }
    dispatch(
      setCall({
        calling: false,
        refused: false,
        ended: true
      })
    );

    // destrop peer
    stopStreamAndDestroyPeer();
  });
  // handle close call
  const handleCloseCall = () => {
    // destrop peer
    stopStreamAndDestroyPeer();
    window.close();
  };

  // handle recall
  const handleRecall = () => {
    emitVideoCall({
      conversation_id: call.conversation.conversation_id,
      peer_id: peer_id
    });
    initPeer();
    setDuration(0);
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
            <Flex
              id="video-frame"
              className={`relative w-full h-full gap-4 p-4 grid ${
                remoteStreams.length === 0
                  ? 'grid-cols-1 grid-rows-1'
                  : remoteStreams.length === 1
                  ? 'grid-cols-2 grid-rows-1'
                  : 'grid-cols-2 grid-rows-2'
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
            {showMembers && (
              <div className="h-full w-[30%] bg-[#202124] py-4 pe-4">
                <Flex vertical className="h-full bg-[#3c4043] p-2">
                  <p>Members</p>
                  <Flex vertical className="gap-3 py-4">
                    {call.members.map((member) => {
                      return (
                        <>
                          <MemberItem
                            avatar={member.avatar}
                            name={member.name}
                          />
                        </>
                      );
                    })}
                  </Flex>
                </Flex>
              </div>
            )}
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

const VideoFrame = ({ name, videoRef }) => {
  return (
    <Flex align="center" justify="center" className="relative bg-[#3c4043] p-2">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-full max-h-full"
      />
      <div className="bg-[#202124] absolute bottom-[10px] left-[10px] px-2 py-1 rounded">
        {name}
      </div>
    </Flex>
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
