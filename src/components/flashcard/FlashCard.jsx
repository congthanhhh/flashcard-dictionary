import React, { useState } from 'react';

const flashcards = [
  { front: 'Apple', back: 'Quả táo' },
  { front: 'Dog', back: 'Con chó' },
  { front: 'Run', back: 'Chạy' },
];

export default function FlashCard() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = flashcards[index];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className="w-64 h-40 relative"
        style={{ perspective: '1000px' }} // 👈 không có trong Tailwind
      >
        <div
          className={`w-full h-full transition-transform duration-500 relative`}
          style={{
            transformStyle: 'preserve-3d', // 👈 không có trong Tailwind
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', // 👈 không có trong Tailwind
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-white rounded-xl shadow-md flex items-center justify-center text-xl font-bold"
            style={{
              backfaceVisibility: 'hidden', // 👈 không có trong Tailwind
            }}
          >
            {card.front}
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-blue-100 rounded-xl shadow-md flex items-center justify-center text-xl font-bold"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            {card.back}
          </div>
        </div>
      </div>

      <div className="mt-4 space-x-4">
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
  );
}
