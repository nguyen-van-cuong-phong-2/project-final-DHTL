"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";

// Define the interface for the object contained in the array
interface Message {
  id: number;
  avatar: string;
  name: string;
}

// Define the interface for the context
interface MyContextType {
  arrMessage: Message[];
  updateArrMessage: (newMessage: Message) => void;
  DeleteArrMessage: (id: Number) => void;
}

// Create the context with an initial value
const MyContext = createContext<MyContextType | undefined>(undefined);

// Define the provider component
export const MyContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [arrMessage, setArrMessage] = useState<Message[]>([]);

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
  return (
    <MyContext.Provider
      value={{ arrMessage, updateArrMessage, DeleteArrMessage }}
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
