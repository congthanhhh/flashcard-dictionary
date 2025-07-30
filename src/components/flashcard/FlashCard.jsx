import React, { useState } from "react";

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
      <h1 className="text-3xl font-bold text-center my-10">
        Luyện tập: Từ vựng tiếng Anh văn phòng
      </h1>

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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
      </div>
    </div>
  );
}
