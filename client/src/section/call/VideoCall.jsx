import { Avatar, Button, Space } from 'antd';
import Peer from 'peerjs';
import { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import {
  IoMicOffOutline,
  IoMicOutline,
  IoVideocamOffOutline,
  IoVideocamOutline
} from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { SocketContext } from '~/contexts/socketContext';
import { useSocket } from '~/hooks/useSocket';
import { useDispatch, useSelector } from '~/store';
import { setCall } from '~/store/slices/chatSlice';
const VideoCall = () => {
  const { socketInstance } = useContext(SocketContext);
  const dispatch = useDispatch();
  const { conversation_id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { call } = useSelector((state) => state.chat);
  const { emitVideoCall } = useSocket();
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peer, setPeer] = useState();
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    const callTranfer = JSON.parse(localStorage.getItem('call'));
    dispatch(setCall(callTranfer));
    const peer = new Peer(`${conversation_id}-${callTranfer.owner ? 1 : 2}`);
    console.log('====================================');
    console.log('peer id', `${conversation_id}-${callTranfer.owner ? 1 : 2}`);
    console.log('====================================');
    setPeer(peer);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        setStream(localStream);
        // on call
        peer.on('call', (call) => {
          console.log('on-call', call);
          call.answer(localStream);
          // on stream
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        });
      })
      .catch((err) => {
        console.error('Failed to get local stream', err);
      });
    if (callTranfer.owner) {
      emitVideoCall({ conversation_id });
    }
  }, [dispatch, socketInstance]);

  useEffect(() => {
    if (peer && call.calling && stream) {
      const myCall = peer.call(
        `${conversation_id}-${call.owner ? 2 : 1}`,
        stream
      );
      if (myCall) {
        myCall.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      }
    }
  }, [peer, stream, call]);
  // set stream to video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);
  // set remote video stream
  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);
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
    <div className="w-[100vw] h-[100vh] relative bg-black flex items-center justify-center text-white">
      {call.calling ? (
        <>
          <div className="absolute top-0 right-0 w-full h-full">
            <video
              ref={remoteVideoRef}
              className="w-full h-full"
              autoPlay
              playsInline
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
          <h2 className="my-3 text-[20px] font-semibold">Hoàng Công Khanh</h2>
          <p className="text-[#777]">Đang gọi...</p>
        </div>
      )}
      <div className="absolute top-0 right-0 w-[280px] h-[200px] m-4 rounded-lg overflow-hidden">
        <video ref={videoRef} className="w-full h-full" autoPlay playsInline />
      </div>

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
        />
      </Space>
    </div>
  );
};
export default VideoCall;
