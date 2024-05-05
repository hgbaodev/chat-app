import Peer from 'peerjs';
import React, { useContext, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '~/contexts/socketContext';
import { useSocket } from '~/hooks/useSocket';
import { useDispatch, useSelector } from '~/store';
import { setCall } from '~/store/slices/chatSlice';
import { CallTypes, ConversationTypes } from '~/utils/enum';
import VideoCall from './VideoCall';
import VoiceCall from './VoiceCall';
import { set } from 'lodash';
const CallWrapper = () => {
  const { socketInstance } = useContext(SocketContext);
  const dispatch = useDispatch();
  const { call_type, conversation_id, peer_id } = useParams();
  const { call } = useSelector((state) => state.chat);
  const {
    emitGetPeerIds,
    emitLeaveVideoCall,
    emitCancelVideoCall,
    emitEndVideoCall,
    emitVideoCall
  } = useSocket();

  const videoRef = useRef(null);
  const [peer, setPeer] = useState();
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const videoRefs = remoteStreams.map(() => React.createRef());
  const [duration, setDuration] = useState(0);
  const [gridLayout, setGridLayout] = useState(1);

  const initPeer = useCallback(() => {
    if (socketInstance) {
      const peerInstance = new Peer(peer_id, {
        config: {
          iceServers: [
            {
              urls: 'stun:stun.relay.metered.ca:80'
            },
            {
              urls: 'turn:sg.relay.metered.ca:80',
              username: '8b743f9ddbf2ebef110702b9',
              credential: 'fZZ3K5SbdiVz2llK'
            },
            {
              urls: 'turn:sg.relay.metered.ca:80?transport=tcp',
              username: '8b743f9ddbf2ebef110702b9',
              credential: 'fZZ3K5SbdiVz2llK'
            },
            {
              urls: 'turn:sg.relay.metered.ca:443',
              username: '8b743f9ddbf2ebef110702b9',
              credential: 'fZZ3K5SbdiVz2llK'
            },
            {
              urls: 'turns:sg.relay.metered.ca:443?transport=tcp',
              username: '8b743f9ddbf2ebef110702b9',
              credential: 'fZZ3K5SbdiVz2llK'
            }
          ]
        }
      });
      emitGetPeerIds({ conversation_id, type: call_type, peer_id: peer_id });
      if (peer) peer.destroy();
      setPeer(peerInstance);
      navigator.mediaDevices
        .getUserMedia({ video: call_type == CallTypes.VIDEO, audio: true })
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
                  setGridLayout((prev) => Math.sqrt(prev + 2));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketInstance]);
  useEffect(() => {
    initPeer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    setGridLayout((prev) => Math.sqrt(prev + 2));
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
    setGridLayout(Math.sqrt(peer_ids.length + 1));
    setRemoteStreams((preStream) =>
      preStream.filter((stream) => peer_ids.includes(stream.peer_id))
    );
  }, [call.members]);

  // set stream to video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (call_type == CallTypes.VIDEO)
    return (
      <VideoCall
        stream={stream}
        remoteStreams={remoteStreams}
        duration={duration}
        videoRef={videoRef}
        videoRefs={videoRefs}
        gridLayout={gridLayout}
        handleCloseCall={handleCloseCall}
        handleLeaveCall={handleLeaveCall}
        handleRecall={handleRecall}
      />
    );
  return (
    <VoiceCall
      stream={stream}
      remoteStreams={remoteStreams}
      duration={duration}
      videoRef={videoRef}
      videoRefs={videoRefs}
      gridLayout={gridLayout}
      handleCloseCall={handleCloseCall}
      handleLeaveCall={handleLeaveCall}
      handleRecall={handleRecall}
    />
  );
};

export default CallWrapper;
