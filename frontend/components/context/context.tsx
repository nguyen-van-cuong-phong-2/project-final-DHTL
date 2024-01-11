"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { io } from "socket.io-client";
import { functions } from "../../functions/functions";


// Define the interface for the object contained in the array
interface Message {
  id: number;
  avatar: string;
  name: string;
}

interface Users {
  id: number,
  avatar: string,
  name: string
}
// Define the interface for the context
interface MyContextType {
  arrMessage: Message[];
  updateArrMessage: (newMessage: Message) => void;
  DeleteArrMessage: (id: Number) => void;
  socket: any;
  Loading: boolean;
  setLoading: any;
  contentNotifi: string;
  SetContentNotifi: any;
  user: Users;
  SetUser: any;
  totalNoti: number;
  SetTotalNoti: any;
  comment: any;
  setComment: any;
  totalMessage: number;
  SetTotalMessage: any;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [arrMessage, setArrMessage] = useState<Message[]>([]);
  const [socket, SetSocket] = useState<any>();
  const [Loading, SetLoading] = useState(false);
  const [contentNotifi, SetContentNotifi] = useState('');
  const [user, SetUser] = useState<Users>();
  const [totalNoti, SetTotalNoti] = useState<number>(0);
  const [totalMessage, SetTotalMessage] = useState<number>(0);
  const [comment, setComment] = useState<any>({
    content: "Viết bình luận...",
    parent_id: 0
  });
  useEffect(() => {
    const user = new functions().getInfoFromToken();

    const socketIO = io(`${process.env.NEXT_PUBLIC_DOMAIN_SOCKET}`);
    if (user) {
      socketIO.emit('login', { id: user.id })
    }
    if (socketIO) SetSocket(socketIO);
    socketIO.on('notification', (data) => {
      SetTotalNoti(data.data.totalNotifi)
      if (data?.data?.type == 1) {
        SetContentNotifi(`${data.data.sender_id.name} đã gửi lời mời kết bạn!`)
      } else if (data?.data?.type == 2) {
        SetContentNotifi(`${data.data.sender_id.name} đã chấp nhận kết bạn!`)
      } else if (data?.data?.type == 3 && data.data.type_enmoji == 0) {
        SetContentNotifi(`${data.data.sender_id.name} đã thích bài viết của bạn!`)
      } else if (data?.data?.type == 3 && data.data.type_enmoji != 0) {
        SetContentNotifi(`${data.data.sender_id.name} đã thả cảm xúc về bài viết của bạn!`)
      } else if (data?.data?.type == 4) {
        SetContentNotifi(`${data.data.sender_id.name} đã bình luận về bài viết của bạn!`)
      } else if (data?.data?.type == 5) {
        SetContentNotifi(`${data.data.sender_id.name} đã trả lời bình luận của bạn trong 1 bài viết!`)
      } else if (data?.data?.type == 6) {
        SetContentNotifi(`${data.data.sender_id.name} đã thích bình luận của bạn trong 1 bài viết!`)
      }
    });
    if (user) {
      socketIO.on("Message", (data) => {
        if (data.id == user.id) {
          SetTotalMessage(data.total)
        }
      })
    }

    return () => {
      socketIO.disconnect();
    };
  }, []);

  const updateArrMessage = (newMessage: Message) => {
    const findItem = arrMessage.find((item) => item.id == newMessage.id);

    if (arrMessage.length < 3 && !findItem) {
      setArrMessage((prevArr) => [...prevArr, newMessage]);
    }
    if (arrMessage.length == 3 && !findItem) {
      arrMessage.shift();
      setArrMessage((prevArr) => [...prevArr, newMessage]);
    }
  };

  const DeleteArrMessage = (id: Number) => {
    const findItem = arrMessage.filter((item) => item.id != id);
    setArrMessage(findItem);
  };

  const setLoading = (type: boolean) => {
    SetLoading(type)
  }
  return (
    <MyContext.Provider
      value={{
        arrMessage,
        updateArrMessage,
        socket,
        DeleteArrMessage,
        Loading,
        setLoading,
        contentNotifi,
        SetContentNotifi,
        user,
        SetUser,
        totalNoti,
        SetTotalNoti,
        comment,
        setComment,
        totalMessage,
        SetTotalMessage
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Define the hook to access the context
export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
