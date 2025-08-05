import React, { useState, useRef } from "react";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  FrownOutlined,
  MehOutlined,
  PlusOutlined,
  RetweetOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Carousel } from "antd";

const flashcards = [
  { front: "Apple", back: "Quả táo" },
  { front: "Dog", back: "Con chó" },
  { front: "Run", back: "Chạy" },
];

export default function FlashCard() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const carouselRef = useRef(null);

  const handleNext = () => {
    carouselRef.current?.next();
    setFlipped(false);
  };

  const handlePrevious = () => {
    carouselRef.current?.prev();
    setFlipped(false);
  };

  const handleSlideChange = (currentSlide) => {
    setIndex(currentSlide);
    setFlipped(false);
  };

  return (
    <div className="bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-8">
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
        <div className="w-[750px] h-[350px]">
          <Carousel
            ref={carouselRef}
            afterChange={handleSlideChange}
            dots={false}
            infinite={true}
            speed={800}
          >
            {flashcards.map((cardData, cardIndex) => (
              <div key={cardIndex}>
                <div
                  className="w-[750px] h-[350px] relative"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="w-full h-full transition-transform duration-500 relative border-x-2 border-slate-100"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: flipped && cardIndex === index ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front */}
                    <div
                      className="absolute w-full h-full bg-white  shadow-md flex items-center justify-center text-xl font-bold"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {cardData.front}
                    </div>

                    {/* Back */}
                    <div
                      className="absolute w-full h-full bg-blue-100 shadow-md flex items-center justify-center text-xl font-bold"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {cardData.back}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="relative flex">
          <div className="mt-5 space-x-4 mb-5">
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePrevious}
              size="large"
            >
              <ArrowLeftOutlined className="px-2 text-lg" />
            </Button>
            <Button
              onClick={() => setFlipped(!flipped)}
              variant="outlined"
              color="primary"
              size="large"
            >
              <RetweetOutlined className="px-2 text-lg" />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleNext}
              size="large"
            >
              <ArrowRightOutlined className="px-2 text-lg" />
            </Button>
          </div>
          <div className="absolute right-[-114%] bottom-[25%]">
            <Button size="large" variant="outlined" color="danger" icon={<MehOutlined />}>
              Học lại
            </Button>
          </div>
          <div className="absolute left-[-114%] bottom-[25%]">
            <Button size="large" variant="outlined" color="green" icon={<PlusOutlined />}>
              List của tôi
            </Button>
          </div>
        </div>
        <div className="mb-8 ">
        </div>
      </div>
    </div>
  );
}
