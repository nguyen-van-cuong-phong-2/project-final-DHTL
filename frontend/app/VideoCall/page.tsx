"use client";
import { useEffect, useRef, useState } from "react";
import { useMyContext } from "../../components/context/context";
import { functions } from "../../functions/functions";
import { FaPhoneSlash } from "react-icons/fa6";
import { callApi_EndVideoCall, callApi_CreateVideoCall } from "../../api/callAPI";
import Image from "next/image";

const Index = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const func = new functions();
  const user = func.getInfoFromToken();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [endCall, setEndCall] = useState(false);
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
      } else if(data.type ==5){
        endVideoCall()
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
      remoteVideoRef.current.srcObject = localStream || remoteStream;
    }
  }, [localStream, remoteStream]);
  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: {
        //   echoCancellation: true,
        //   autoGainControl: true,
        //   noiseSuppression: true,
        // },
        audio: false
      });

      setLocalStream(stream);

      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      if (Number(userCall) == user.id) {
        socket.emit("call", { userCall, userReceiveCall });
      } else {
        await callApi_CreateVideoCall({ sender_id: userCall, receiver_id: userReceiveCall })
        socket.emit("answer_call_socket", { type: 2, userCall, userReceiveCall });
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const endVideoCall = async () => {
    await callApi_EndVideoCall({ sender_id: userCall, receiver_id: userReceiveCall });
    socket.emit("answer_call_socket", { type: 5, userCall, userReceiveCall });
    setEndCall(true)
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
      {endCall ? <div className="w-screen h-screen bg-[url('/images/call.png')] bg-no-repeat">
      </div> : <div className="w-full flex justify-center h-screen bg-black">
        <div className="w-[70%] relative h-full top-0">
          <video
            id="remoteVideo"
            autoPlay
            playsInline
            ref={remoteVideoRef}
            width="100%"
            style={{ height: "100%" }}
          ></video>
          <div className="absolute bottom-10 left-1/2 bg-white p-5 rounded-full flex justify-center items-center opacity-20 hover:opacity-100 cursor-pointer" onClick={() => endVideoCall()}>
            <FaPhoneSlash className="text-red-600 text-2xl"></FaPhoneSlash>
          </div>
          <div className="absolute bottom-0 right-0 w-60 h-60">
            <video id="localVideo" autoPlay playsInline ref={localVideoRef}
              width="100%"
              height="100%"
            ></video>
          </div>
        </div>
      </div>}


    </>
  );
};
export default Index;
