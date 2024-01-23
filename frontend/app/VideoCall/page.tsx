"use client";
import { useEffect, useRef, useState } from "react";
import { useMyContext } from "../../components/context/context";
import { functions } from "../../functions/functions";

const Index = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const func = new functions();
  const user = func.getInfoFromToken();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { socket, SetContentNotifi } = useMyContext();
  const userCall = searchParams.userCall;
  const userReceiveCall = searchParams.userReceiveCall;
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = new RTCPeerConnection();

  async function handleOffer(offer: any) {
    try {
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            data: event.candidate,
            userCall,
            userReceiveCall,
            type: 2,
          });
        }
      };
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };
      await peerConnection.setRemoteDescription(offer.data);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", {
        data: peerConnection.localDescription,
        userCall,
        userReceiveCall,
        type: 2,
      });
    } catch (error) {
      console.log("🚀 ~ handleOffer ~ error:", error)
    }
  }

  async function handleAnswer(answer: any) {
    try {
      await peerConnection.setRemoteDescription(answer.data);
    } catch (error) {
      console.log("🚀 ~ handleAnswer ~ error:", error)
    }
  }
  async function handleIceCandidate(candidate: any) {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate.data));
    } catch (error) {
      console.log("🚀 ~ handleIceCandidate ~ error:", error)
    }
  }

  async function handleCall(data: any) {
    try {
      if (data.type == 2) {
        peerConnection.onicecandidate = (event) => {
          if (event.candidate && Number(userCall) == user.id) {
            socket.emit("ice-candidate", {
              data: event.candidate,
              userCall,
              userReceiveCall,
              type: 1,
            });
          }
        };
        peerConnection.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", {
          data: peerConnection.localDescription,
          userCall,
          userReceiveCall,
          type: 1,
        });
      } else if (data.type == 3) {
        SetContentNotifi("Người dùng đã tắt máy");
      }
    } catch (error) {
      console.log("🚀 ~ handleCall ~ error:", error)
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("offer", handleOffer);

      socket.on("answer", handleAnswer);

      socket.on("ice-candidate", handleIceCandidate);

      socket.on("answer_call", handleCall);

      startVideoCall();

      return () => {
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
        socket.off("answer_call");
      };
    }
  }, [socket]);
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);
  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      if (Number(userCall) == user.id) {
        socket.emit("call", { userCall, userReceiveCall });
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const endVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track: any) => track.stop());
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track: any) => track.stop());
    }

    setLocalStream(null);
    setRemoteStream(null);
  };
  return (
    <>
      <div className="w-full flex justify-center h-screen bg-black">
        <div className="w-[70%] relative h-full">
          <video
            id="remoteVideo"
            autoPlay
            playsInline
            ref={remoteVideoRef}
            width="100%"
            style={{height:"100%"}}
></video>
          <div className="absolute bottom-0 right-0 w-60 h-60">
            <video id="localVideo" autoPlay playsInline ref={localVideoRef}
              width="100%"
              height="100%"
            ></video>
          </div>
        </div>
      </div>
    </>
  );
};
export default Index;
