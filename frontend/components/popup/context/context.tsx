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
import { callApi_getInforUser } from "../../api/callAPI";
import { useRouter } from "next/navigation";

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
}

// Create the context with an initial value
const MyContext = createContext<MyContextType | undefined>(undefined);

// Define the provider component
export const MyContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [arrMessage, setArrMessage] = useState<Message[]>([]);
  const [socket, SetSocket] = useState<any>();
  const [Loading, SetLoading] = useState(false);
  const [contentNotifi, SetContentNotifi] = useState('');
  const [user, SetUser] = useState<Users>();
  const router = useRouter()
  useEffect(() => {
    const socketIO = io(`${process.env.NEXT_PUBLIC_DOMAIN_SOCKET}`);

    if (socketIO) SetSocket(socketIO);

    const fetchAPIGetInfo = async () => {
      const token = new functions().getInfoFromToken();
      if (token) {
        socketIO.emit("login", { id: token.id })
        const response = await callApi_getInforUser({ id: Number(token.id) });
        SetUser(response.data[0]);
      } else {
        return {
          redirect: {
            destination: "/Login",
            permanent: false,
          },
        }
      }
    }

    fetchAPIGetInfo();
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
      value={{ arrMessage, updateArrMessage, DeleteArrMessage, socket, Loading, setLoading, contentNotifi, SetContentNotifi, user, SetUser }}
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
