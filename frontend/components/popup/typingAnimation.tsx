export function AnimationTyping() {
  return (
    <>
      <div className="chat-bubble bg-BGICon p-2 rounded-full inline-block">
        <div className="typing flex items-center h-4">
          <div
            className="dot bg-gray-300 rounded-full p-1 animate-slide"
            // style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className="dot bg-gray-300 rounded-full p-1 animate-slide ml-1"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="dot bg-gray-300 rounded-full p-1 animate-slide ml-1"
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>
      </div>
    </>
  );
}
