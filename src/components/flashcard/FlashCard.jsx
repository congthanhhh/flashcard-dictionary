import React, { useState } from "react";
import {
  CalendarOutlined,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const flashcards = [
  { front: "Apple", back: "Quả táo" },
  { front: "Dog", back: "Con chó" },
  { front: "Run", back: "Chạy" },
];

export default function FlashCard() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = flashcards[index];

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">
        Luyện tập: Từ vựng tiếng Anh văn phòng
      </h1>

      <div className="flex items-center justify-center mb-5 text-lg font-normal text-blue-800">
        <span className="w-1 h-1 rounded-full bg-blue-800 inline-block mr-2 ml-2"></span>
        <a className="">Xem tất cả</a>
        <span className="w-1 h-1 rounded-full bg-blue-800 inline-block mr-2 ml-2"></span>
        <a className="" href="">
          Cài đặt chế độ review
        </a>
        <span className="w-1 h-1 rounded-full bg-blue-800 inline-block mr-2 ml-2"></span>
        <a className="" href="">
          Các từ đã bỏ qua
        </a>
        <a
          className="text-lg font-normal text-red-500 hover:text-red-600 ml-24 flex items-center relative"
          href=""
        >
          <span className="relative flex items-center justify-center mr-2 text-xl">
            <CalendarOutlined />
          </span>
          Dừng học list từ này
        </a>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div
          className="w-[745px] h-[350px] relative"
          style={{ perspective: "1000px" }}
        >
          <div
            className={`w-full h-full transition-transform duration-500 relative`}
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute w-full h-full bg-gray-100 rounded-xl shadow-md flex items-center justify-center text-xl font-bold"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              {card.front}
            </div>

            {/* Back */}
            <div
              className="absolute w-full h-full bg-blue-100 rounded-xl shadow-md flex items-center justify-center text-xl font-bold"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            >
              {card.back}
            </div>
          </div>
        </div>

        <div className="mt-5 space-x-4 mb-5">
          <button
            onClick={() => setFlipped(!flipped)}
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
          >
            Flip
          </button>
          <button
            onClick={() => {
              setIndex((i) => (i + 1) % flashcards.length);
              setFlipped(false);
            }}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
        <div className="mb-8 flex justify-between items-center w-full max-w-4xl mx-auto px-8">
          <button
            type="button"
            className="flex flex-col items-center flex-1 focus:outline-none group cursor-pointer bg-transparent border-0"
            onClick={() => alert("Bạn chọn Dễ!")}
          >
            <SmileOutlined className="text-3xl text-green-500 group-hover:scale-110 transition-transform" />
            <span className="mt-2 text-green-600 font-semibold">
              Dễ
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center flex-1 focus:outline-none group cursor-pointer bg-transparent border-0"
            onClick={() => alert("Bạn chọn Trung bình!")}
          >
            <MehOutlined className="text-3xl text-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="mt-2 text-yellow-600 font-semibold">
              Trung bình
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center flex-1 focus:outline-none group cursor-pointer bg-transparent border-0"
            onClick={() => alert("Bạn chọn Khó!")}
          >
            <FrownOutlined className="text-3xl text-red-500 group-hover:scale-110 transition-transform" />
            <span className="mt-2 text-red-600 font-semibold">
              Khó
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center flex-1 focus:outline-none group cursor-pointer bg-transparent border-0"
            onClick={() => alert("Bạn chọn Đã biết!")}
          >
            <span className="text-3xl text-blue-400 group-hover:scale-110 transition-transform">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 12h2m4 0h2m-7 0a5 5 0 1 1 10 0 5 5 0 0 1-10 0Zm10 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12l2 2m0-2l-2 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="mt-2 text-blue-400 font-semibold text-center">
              Đã biết, loại khỏi
              <br />
              danh sách ôn tập
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
