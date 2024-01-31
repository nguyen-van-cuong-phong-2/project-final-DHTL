import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiFillLike } from "react-icons/ai";
type message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  created_at: number;
  content: string;
  seen: number;
  messageLastSeen: boolean;
  image: string;
  video: string;
  id_story: number;
  like: number;
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

  const router = useRouter();
  const navigateTo = (link: string) => {
    router.push(link)
  }
  return (
    <>{show && <div>
      {own ? (
        <div className={`w-full flex items-end ${message.id_story && message.id_story != 0 ? 'mb-3' : 'mt-1'}`}>
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
              {!message.id_story && message.id_story == 0 && message.like == 0 && <div className="bg-BGICon p-2 text-base w-max border rounded-xl max-w-[250px] break-words">
                {message.content}
              </div>}
              {message.id_story && message.id_story != 0 && message.image != null ? <div className="w-20 h-28 relative mr-4"
                onClick={() => navigateTo(`/Stories?id=${message.id_story}`)}
              >
                <Image
                  alt="gà"
                  src={message.image}
                  fill
                  objectFit="cover"
                  className="rounded-lg opacity-60 cursor-pointer"
                >
                </Image>
                <div className="absolute bottom-[-10px] max-w-[200px] bg-BGICon px-2 py-1 text-base w-max border rounded-xl">
                  {message.content}
                </div>
              </div> : <></>}
              {message.id_story && message.id_story != 0 && message.video != null ? <div className="w-20 relative h-28 mr-4">
                <video
                  src={message.video}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", opacity: "60%" }}
                  onClick={() => navigateTo(`/Stories?id=${message.id_story}`)}
                >
                </video>
                <div className="absolute bottom-[-10px] max-w-[200px] bg-BGICon px-2 py-1 text-base w-max border rounded-xl">
                  {message.content}
                </div>
              </div> : <></>}
              {message.like == 1 && <div className=" p-2 text-3xl w-max max-w-[250px] mr-4 text-white break-words">
                <AiFillLike className="h-full w-full text-blue-500"></AiFillLike>
              </div>}
            </div>
          </div>
        </div>
      ) : (
        <div className={`w-full flex justify-end items-end ${message.id_story && message.id_story != 0 ? 'mt-5' : 'mt-1'}`}>
          {!message.id_story && message.id_story == 0 && message.like == 0 && <div className=" p-2 text-base w-max border rounded-xl max-w-[250px] bg-BGMessages mr-4 text-white break-words">
            {message.content}
          </div>}
          {message.id_story && message.id_story != 0 && message.image != null ? <div className="w-20 h-28 relative mr-4"
            onClick={() => navigateTo(`/Stories?id=${message.id_story}`)}
          >
            <Image
              alt="gà"
              src={message.image}
              fill
              objectFit="cover"
              className="rounded-lg opacity-60 cursor-pointer"
            >
            </Image>
            <div className="absolute bottom-[-10px] max-w-[200px] bg-BGICon px-2 py-1 text-base w-max border rounded-xl">
              {message.content}
            </div>
          </div> : <></>}
          {message.id_story && message.id_story != 0 && message.video != null ? <div className="w-20 relative h-28 mr-4">
            <video
              src={message.video}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", opacity: "60%" }}
              onClick={() => navigateTo(`/Stories?id=${message.id_story}`)}
            >
            </video>
            <div className="absolute bottom-[-10px] max-w-[200px] bg-BGICon px-2 py-1 text-base w-max border rounded-xl">
              {message.content}
            </div>
          </div> : <></>}
          {message.like == 1 && <div className=" p-2 text-3xl w-max max-w-[250px] mr-4 text-white break-words">
            <AiFillLike className="h-full w-full text-blue-500"></AiFillLike>
          </div>}
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
