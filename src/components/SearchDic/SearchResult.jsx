import React from "react";

const SearchResult = () => {
  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <div className="flex">
        <div className="font-bold text-[30px] text-blue-500">Sad</div>
        <div className="text-[30px] ml-2">/sæd/</div>
      </div>
      <div className="border-b border-gray-950"></div>
      <div className="font-bold text-xl text-center bg-gray-200 w-20 mt-6">
        Tính từ
      </div>
      <div>
        <div className="flex mt-2">
          <div className="border-l-8 border-green-500"></div>
          <div className="font-bold text-lg ml-2">Buồn</div>
        </div>
      </div>
      <div>
        <div className="font-bold text-lg mr-2 mt-4">Ex:</div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
          <div className="font-normal text-lg text-blue-400">Sad news</div>
        </div>
      </div>
      <div className="font-normal text-lg ml-4">Tin buồn</div>
      <div>
        <div className="flex mt-2">
          <div className="border-l-8 border-green-500"></div>
          <div className="font-bold text-lg ml-2">Đáng buồn; tồi tệ</div>
        </div>
      </div>
      <div>
        <div className="font-bold text-lg mr-2 mt-4">Ex:</div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
          <div className="font-normal text-lg text-blue-400">
            This once beautiful ship is in a sad condition now
          </div>
        </div>
      </div>
      <div className="font-normal text-lg ml-4">
        Chiếc tàu ấy ngày nào đẹp thế mà nay đã trong tình trạng tồi tệ
      </div>
    </div>
  );
};

export default SearchResult;



