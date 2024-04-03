import { Avatar, Button, Space } from 'antd';
import Peer from 'peerjs';
import React, { useContext, useEffect, useRef } from 'react';
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
import { useParams } from 'react-router-dom';
import { SocketContext } from '~/contexts/socketContext';
import { useSocket } from '~/hooks/useSocket';
import { useDispatch, useSelector } from '~/store';
import { setCall } from '~/store/slices/chatSlice';
const VideoCall = () => {
  const { socketInstance } = useContext(SocketContext);
  const dispatch = useDispatch();
  const { peer_id } = useParams();
  const { call } = useSelector((state) => state.chat);
  const { emitGetPeerIds, emitLeaveVideoCall } = useSocket();
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const videoRef = useRef(null);
  const [peer, setPeer] = useState();
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const videoRefs = remoteStreams.map(() => React.createRef());

  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    let conversation_id = params.get('conversation_id');
    if (socketInstance) {
      const peerInstance = new Peer(peer_id);
      emitGetPeerIds({ conversation_id });
      if (peer) peer.destroy();
      peerInstance.on('open', (peer_id) => {
        console.log('My peer id' + peer_id);
      });
      setPeer(peerInstance);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          setStream(localStream);
          // on call
          peerInstance.on('call', (call) => {
            console.log('Call received', call);
            call.answer(localStream);
            call.on('stream', (remoteStream) => {
              console.log('Received peer_id on stream:', call.peer);
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
          peerInstance.on('error', function (err) {
            console.log('PeerJS error:', err);
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
    if (peer && call.calling && stream) {
      peer.on('open', (my_peer_id) => {
        try {
          call.peer_ids.forEach((peer_id) => {
            if (peer_id !== my_peer_id) {
              const myCall = peer.call(peer_id, stream);
              myCall.on('stream', (remoteStream) => {
                console.log('Received peer_id on stream:', myCall.peer);
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

  // on listener peer_ids change
  useEffect(() => {
    console.log('peer_ids changed', call.peer_ids);
    setRemoteStreams((preStream) =>
      preStream.filter((stream) => call.peer_ids.includes(stream.peer_id))
    );
  }, [call.peer_ids]);

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
  const handleLeaveCall = () => {
    emitLeaveVideoCall({
      conversation_id: call.conversation.conversation_id,
      peer_id: peer_id
    });
    dispatch(
      setCall({
        calling: false,
        refused: false,
        ended: true
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
        // handleInteruptCall();
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
    <div className="w-[100vw] h-[100vh]  bg-[#202124] flex flex-col items-center  text-white">
      <div className="flex-1 w-full h-[100%] flex items-center justify-center ">
        {call.refused ? (
          <p>{call.conversation?.title} has refused this call.</p>
        ) : call.ended ? (
          <p>This call has ended.</p>
        ) : (
          <div
            id="video-frame"
            className="relative w-full h-full gap-4 p-4"
            style={{
              height: '100%',
              display: 'grid',
              gridTemplateColumns: `${
                remoteStreams.length === 0 ? '1fr' : '1fr 1fr'
              }`,
              gridTemplateRows: `repeat(${remoteStreams.length}, 1fr)`
            }}
          >
            <div
              className="relative bg-[#3c4043] p-2 flex items-center justify-center"
              style={{
                height: `${remoteStreams.length < 2 ? '100%' : '50%'}`
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="max-w-full max-h-full"
              />
              <div className="bg-[#202124] absolute bottom-[10px] left-[10px] px-2 py-1 rounded">
                You
              </div>
            </div>
            {remoteStreams.map((stream, index) => (
              <div
                key={index}
                className="relative bg-[#3c4043] p-2 flex items-center justify-center"
                style={{
                  height: `${remoteStreams.length < 2 ? '100%' : '50%'}`
                }}
              >
                <video
                  ref={videoRefs[index]}
                  autoPlay
                  playsInline
                  className="w-full max-w-full max-h-full"
                />
                <div className="bg-[#202124] absolute bottom-[10px] left-[10px] px-2 py-1 rounded">
                  {stream.peer_id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#3c4043] w-full flex justify-between p-3">
        <div className="flex items-center w-[30%]">
          <Avatar size={40} src={call.conversation?.image} />
          <h2 className="ml-2 my-3 text-[14px] font-semibold">
            {call.conversation?.title}
          </h2>
        </div>
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
              onClick={null}
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
        <div className="w-[30%] flex justify-end">
          <Button
            type="default"
            shape="circle"
            icon={<IoEllipsisVerticalSharp size={20} />}
            size={'large'}
            onClick={null}
          />
        </div>
      </div>
    </div>
  );
};
export default VideoCall;
