import { BiSearchAlt2 } from "react-icons/bi";
export const PopUpSearch = () => {
  return (
    <div className="w-full h-20 relative top-40 z-10">
      <input
            placeholder="Tìm kiếm trên bluebook"
            className=" text-2xl w-full mt-1 border rounded-3xl py-2.5 bg-gray-100 pl-12 outline-none focus:border-2 h-14"
          ></input>
          <BiSearchAlt2 className="absolute top-[22px] left-4 text-2xl text-gray-500"></BiSearchAlt2>
    </div>
  );
};
