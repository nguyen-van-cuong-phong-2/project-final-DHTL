export function AnimationTyping() {
  return (
    <>
      <div className=" flex items-center bg-BGICon rounded-2xl px-3 justify-center">
        <div className="dot bg-gray-300 rounded-full p-1 animate-slide"></div>
        <div
          className="dot bg-gray-300 rounded-full p-1 animate-slide ml-1"
          style={{ animationDelay: "300ms" }}
        ></div>
        <div
          className="dot bg-gray-300 rounded-full p-1 animate-slide ml-1"
          style={{ animationDelay: "400ms" }}
        ></div>
      </div>
    </>
  );
}
