import { Avatar, Button, Col, Row, Space } from 'antd';
import { now } from 'lodash';
import Peer from 'peerjs';
import React, { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import {
  IoMicOffOutline,
  IoMicOutline,
  IoVideocamOffOutline,
  IoVideocamOutline,
  IoClose
} from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { SocketContext } from '~/contexts/socketContext';
import { useSocket } from '~/hooks/useSocket';
import { useDispatch, useSelector } from '~/store';
import { setCall, setConversationCall } from '~/store/slices/chatSlice';
const VideoCall = () => {
  const { socketInstance } = useContext(SocketContext);
  const dispatch = useDispatch();
  const { peer_id } = useParams();
  const { call } = useSelector((state) => state.chat);
  console.log('call', call);
  const { emitVideoCall, emitInterruptVideoCall } = useSocket();
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const videoRef = useRef(null);
  const [peer, setPeer] = useState();
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const videoRefs = remoteStreams.map(() => React.createRef());

  useEffect(() => {
    if (socketInstance) {
      const peerInstance = new Peer(peer_id);
      const callTranfer = JSON.parse(localStorage.getItem('call'));
      dispatch(setCall(callTranfer));
      dispatch(
        setConversationCall({ conversation_id: callTranfer.conversation_id })
      );
      if (peer) peer.destroy();
      peerInstance.on('open', (peer_id) => {
        console.log('My peer id' + peer_id);
      });
      setPeer(peerInstance);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          setStream(localStream);
          console.log('peerInstance', peerInstance, now());
          // on call
          peerInstance.on('call', (call) => {
            call.answer(localStream);
            call.on('stream', (remoteStream) => {
              setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
            });
          });
          peerInstance.on('error', function (err) {
            console.log('PeerJS error:', err);
          });
        })
        .catch((err) => {
          console.error('Failed to get local stream', err);
        });
      if (callTranfer.owner) {
        emitVideoCall({
          conversation_id: callTranfer.conversation_id,
          peer_id
        });
      }
      return () => {
        if (peerInstance) {
          peerInstance.destroy();
        }
      };
    }
  }, [socketInstance]);

  useEffect(() => {
    if (peer && call.calling && stream && !call.owner) {
      peer.on('open', (peer_id) => {
        try {
          const myCall = peer.call(call.user.peer_id, stream);
          myCall.on('stream', (remoteStream) => {
            setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
          });

          myCall.on('error', (err) => {
            console.log('Error occurred:', err);
          });
          return () => {
            myCall.close();
          };
        } catch (error) {
          console.log('Error occurred:', error);
        }
      });
    }
  }, [peer, stream, call]);
  // set stream to video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef, call.calling]);
  // set remote video stream
  useEffect(() => {
    remoteStreams.forEach((stream, index) => {
      const videoEl = videoRefs[index].current;
      if (videoEl && videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
    });
  }, [remoteStreams]);
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
  const handleInteruptCall = () => {
    emitInterruptVideoCall({ conversation_id: call.conversation_id });
    dispatch(
      setCall({
        calling: false,
        refused: false,
        ended: true,
        owner: call.owner
      })
    );

    // destrop peer
    stopStreamAndDestroyPeer();
  };
  // handle close call
  const handleCloseCall = () => {
    // destrop peer
    stopStreamAndDestroyPeer();
    window.close();
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (call.calling) {
        handleInteruptCall();
      } else {
        handleCloseCall();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Clean up
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [call]);

  return (
    <div className="w-[100vw] h-[100vh] relative bg-[#efecec] flex items-center justify-center text-white">
      {call.calling ? (
        <div id="video-frame" className={`grid grid-cols-4 w-full h-full`}>
          <div className="p-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
            />
          </div>
          {remoteStreams.map((stream, index) => (
            <div key={index} className="p-4">
              <video
                ref={videoRefs[index]}
                autoPlay
                playsInline
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center ">
          <Avatar
            size={70}
            src={
              'https://res.cloudinary.com/dw3oj3iju/image/upload/v1709628794/chat_app/b6pswhnwsreustbzr8d0.jpg'
            }
          />
          <h2 className="my-3 text-[20px] font-semibold">Tên Thạm Thời</h2>
          {call.refused ? (
            <p className="text-[#777]">Đã từ chối cuộc gọi</p>
          ) : call.ended ? (
            <p className="text-[#777]">Cuộc gọi đã kết thúc</p>
          ) : (
            <p className="text-[#777]">Đang gọi...</p>
          )}
        </div>
      )}

      {call.refused || call.ended ? (
        <Space size={50} className="absolute bottom-[22%] my-5">
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
            onClick={null}
          />
        </Space>
      ) : (
        <Space size={23} className="absolute bottom-0 my-5">
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
            onClick={handleInteruptCall}
          />
        </Space>
      )}
    </div>
  );
};
export default VideoCall;
