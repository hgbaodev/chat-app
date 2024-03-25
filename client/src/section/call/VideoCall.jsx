import { Avatar, Button, Space } from 'antd';
import { now } from 'lodash';
import Peer from 'peerjs';
import { useContext, useEffect, useRef } from 'react';
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
  const { emitVideoCall, emitInterruptVideoCall } = useSocket();
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peer, setPeer] = useState();
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    if (socketInstance) {
      const callTranfer = JSON.parse(localStorage.getItem('call'));
      dispatch(setCall(callTranfer));
      dispatch(
        setConversationCall({ conversation_id: callTranfer.conversation_id })
      );
      if (peer) peer.destroy();
      const peerInstance = new Peer(peer_id);
      console.log('peerInstance', peerInstance, now());

      setPeer(peerInstance);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          setStream(localStream);
          // on call
          peerInstance.on('call', (call) => {
            console.log({ call });
            call.answer(localStream);
            // on stream
            call.on('stream', (remoteStream) => {
              setRemoteStream(remoteStream);
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
    }
  }, [socketInstance]);

  useEffect(() => {
    if (peer && call.calling && stream && !call.owner) {
      const myCall = peer.call(call.user.peer_id, stream);
      console.log('myCall', myCall, now());
      if (myCall) {
        myCall.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
        myCall.on('error', function (err) {
          console.log('Error occurred:', err);
        });
      }
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
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef, call.calling]);
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
    window.close();
    // destrop peer
    stopStreamAndDestroyPeer();
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
        <>
          <div className="absolute top-0 right-0 w-full h-full">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full"
            />
          </div>
        </>
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

      {!call.refused && !call.ended && (
        <div className="absolute top-0 right-0 w-[320px] h-auto m-4 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            autoPlay
            playsInline
          />
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
