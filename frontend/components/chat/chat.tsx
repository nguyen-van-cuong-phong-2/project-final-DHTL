import Image from "next/image";
type message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  created_at: number;
  content: string;
  seen: number;
  messageLastSeen: boolean;
};

interface ChatMessage {
  index: number;
  item: {
    id: number;
    name: string;
    avatar: string;
  };
  own: boolean;
  message: message;
  data: message[];
  show: boolean;
}

export const ChatMessage: React.FC<ChatMessage> = ({
  index,
  item,
  own,
  message,
  data,
  show
}) => {
  return (
    <>{show && <div>
      {own ? (
        <div className="w-full flex items-end mt-1">
          <div className="flex items-end w-full ml-1">
            <div className="w-10 h-10 relative mr-2">
              {data[index]?.sender_id != data[index + 1]?.sender_id && (
                <Image
                  src={item.avatar}
                  alt="avatar"
                  className="
          w-full
          h-full
          border 
          rounded-full
          cursor-pointer
          "
                  fill
                  objectFit="cover"
                ></Image>
              )}
            </div>
            <div>
              {data[index]?.sender_id != data[index - 1]?.sender_id && (
                <div className="text-sm">{item.name}</div>
              )}
              <div className="bg-BGICon p-2 text-base w-max border rounded-xl max-w-[250px] break-words">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-end items-end mt-1 ">
          <div className=" p-2 text-base w-max border rounded-xl max-w-[250px] bg-BGMessages mr-4 text-white break-words">
            {message.content}
          </div>
        </div>
      )}
      {message.seen == 1 && message.messageLastSeen && (
        <div className="w-full flex justify-end">
          <div className="w-4 h-4 relative">
            <Image
              src={item.avatar}
              alt="avatar"
              className="
        w-full
        h-full
        border 
        rounded-full
        "
              fill
              objectFit="cover"
            ></Image>
          </div>
        </div>
      )}
    </div>}


    </>
  );
};
