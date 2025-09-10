import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Progress, Spin } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  HomeOutlined,
  PlusOutlined,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
  SoundOutlined,
  HeartOutlined,
  BulbOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
  getDefaultDeckCards,
  getDefaultDeckId,
  getUserDeckCards,
  getUserDeckById,
  createUserDeckReviewSession,
  createDefaultDeckReviewSession,
  addDefaultCardToPersonalDeck
} from '../../service/deck';
import { submitCardReview } from '../../service/card';
import AddToMyListModal from '../CardModal/AddToMyListModal';

export default function FlashCard() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deck, setDeck] = useState(null);
  const [isUserDeck, setIsUserDeck] = useState(() => {
    return location.state?.isUserDeck || false;
  });
  const swiperRef = useRef(null);
  const [cardRatings, setCardRatings] = useState({});
  const [favoriteCards, setFavoriteCards] = useState(new Set());
  const [showHint, setShowHint] = useState({});
  const [isSmartMode, setIsSmartMode] = useState(false);
  const [reviewedCards, setReviewedCards] = useState(new Set());
  const [showAddToMyListModal, setShowAddToMyListModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const toggleHint = (cardId) => {
    setShowHint(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };


  useEffect(() => {
    let detectedIsUserDeck = false;
    let detectedIsSmartMode = false;

    if (location.state?.isUserDeck !== undefined) {
      detectedIsUserDeck = location.state.isUserDeck;
    }

    if (location.state?.isSmartMode !== undefined) {
      detectedIsSmartMode = location.state.isSmartMode;
    }

    setIsUserDeck(detectedIsUserDeck);
    setIsSmartMode(detectedIsSmartMode);

    if (deckId) {
      setTimeout(() => {
        if (detectedIsSmartMode) {
          createSmartSession(detectedIsUserDeck, location.state?.sessionConfig);
        } else {
          loadAllCards(detectedIsUserDeck);
        }
        loadDeckInfo(detectedIsUserDeck);
      }, 0);
    }
  }, [deckId, location.state]);

  const loadDeckInfo = async (userDeck = isUserDeck) => {
    try {
      let deckInfo;
      if (userDeck) {
        deckInfo = await getUserDeckById(deckId);
      } else {
        deckInfo = await getDefaultDeckId(deckId);
      }
      setDeck(deckInfo);
    } catch (error) {
      console.error('Error loading deck info:', error);
    }
  };

  const loadAllCards = async (userDeck = isUserDeck) => {
    try {
      setLoading(true);

      let response;
      if (userDeck) {
        response = await getUserDeckCards(deckId, 1, 1000);
      } else {
        response = await getDefaultDeckCards(deckId, 1, 1000);
      }

      const cards = (response.cards || []).map(card => {
        return {
          id: card._id,
          front: card.name || 'Unknown Word',
          back: card.definition || 'No Definition',
          type: card.word_type,
          example: card.example,
          phonetic: card.hint,
          category: card.category,
          frequency: card.frequency,
          url: card.url
        };
      });

      setFlashcards(cards);

    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSmartSession = async (userDeck = isUserDeck, sessionConfig) => {
    try {
      setLoading(true);

      let response;
      if (userDeck) {
        response = await createUserDeckReviewSession(deckId, sessionConfig);
      } else {
        response = await createDefaultDeckReviewSession(deckId, sessionConfig);
      }

      const cards = (response.flashcard || []).map(card => {
        return {
          id: card._id,
          front: card.name || 'Unknown Word',
          back: card.definition || 'No Definition',
          type: card.word_type,
          example: card.example,
          phonetic: card.hint,
          category: card.category,
          frequency: card.frequency,
          url: card.url
        };
      });

      setFlashcards(cards);

    } catch (error) {
      console.error('Error creating smart session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (swiperRef.current && index < flashcards.length - 1) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrevious = () => {
    if (swiperRef.current && index > 0) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideChange = (swiper) => {
    setIndex(swiper.activeIndex);
    setFlipped(false);
  };

  const handleCardFlip = () => {
    setFlipped(!flipped);
  };

  const handleDifficultyRating = async (cardId, difficulty) => {
    setCardRatings(prev => ({
      ...prev,
      [cardId]: difficulty
    }));

    if (isUserDeck && isSmartMode) {
      try {
        await submitCardReview(cardId, {
          retrievalLevel: difficulty,
          hintWasShown: showHint[cardId] || false
        });
        setReviewedCards(prev => new Set([...prev, cardId]));
      } catch (error) {
        console.error('Error submitting card review:', error);
      }
    }

    setTimeout(() => {
      if (index < flashcards.length - 1) {
        handleNext();
      }
    }, 500);
  };

  const handleAddToFavorites = (cardId, cardText) => {
    if (!isUserDeck) {
      const currentCard = flashcards.find(card => card.id === cardId);
      if (currentCard) {
        setSelectedCard({
          _id: currentCard.id,
          name: currentCard.front,
          definition: currentCard.back,
          word_type: currentCard.type,
          example: currentCard.example,
          hint: currentCard.phonetic,
          category: currentCard.category,
          url: currentCard.url
        });
        setShowAddToMyListModal(true);
      }
    } else {
      const newFavorites = new Set(favoriteCards);
      if (newFavorites.has(cardId)) {
        newFavorites.delete(cardId);
      } else {
        newFavorites.add(cardId);
      }
      setFavoriteCards(newFavorites);
    }
  };

  const handlePlaySound = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Spin size="large" tip="Đang tải flashcards..." />
      </div>
    );
  }

  // Hiển thị màn hình kết quả khi học xong ở chế độ isSmartMode
  if (isSmartMode && reviewedCards.size === flashcards.length && flashcards.length > 0) {
    const easyCount = Object.values(cardRatings).filter(r => r === 'easy').length;
    const mediumCount = Object.values(cardRatings).filter(r => r === 'medium').length;
    const hardCount = Object.values(cardRatings).filter(r => r === 'hard').length;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center animate-fadeIn">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">🎉 Hoàn thành phiên học thông minh!</h2>
          <p className="text-lg text-gray-700 mb-6">Bạn đã review tất cả <span className="font-semibold text-blue-600">{flashcards.length}</span> thẻ trong deck <span className="font-semibold text-indigo-600">{deck?.name}</span>.</p>
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              <SmileOutlined className="text-green-500 text-3xl mb-1" />
              <span className="font-bold text-green-600 text-xl">{easyCount}</span>
              <span className="text-sm text-gray-500">Dễ</span>
            </div>
            <div className="flex flex-col items-center">
              <MehOutlined className="text-yellow-500 text-3xl mb-1" />
              <span className="font-bold text-yellow-600 text-xl">{mediumCount}</span>
              <span className="text-sm text-gray-500">Trung bình</span>
            </div>
            <div className="flex flex-col items-center">
              <FrownOutlined className="text-red-500 text-3xl mb-1" />
              <span className="font-bold text-red-600 text-xl">{hardCount}</span>
              <span className="text-sm text-gray-500">Khó</span>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-base text-gray-600">Cố gắng luyện tập thêm các thẻ <span className="text-red-500 font-semibold">Khó</span> để ghi nhớ tốt hơn nhé!</p>
          </div>
          <Button
            type="primary"
            size="large"
            className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 px-8"
            onClick={() => navigate(`/card-detail/${deckId}`, { state: { isUserDeck } })}
          >
            Quay lại Deck
          </Button>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Không có flashcard nào
          </h2>
          <Button onClick={() => navigate(`/card-detail/${deckId}`, {
            state: { isUserDeck }
          })}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              icon={<HomeOutlined />}
              onClick={() => navigate(`/card-detail/${deckId}`, {
                state: { isUserDeck }
              })}
              className="flex items-center shadow-sm"
              size="large"
            >
              Quay lại
            </Button>
            <div className="text-center flex-1 mx-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase mb-2">
                {deck?.name || 'Flashcards'}
              </h1>
              <div className="flex justify-center mb-2">
                {isSmartMode ? (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    🧠 Smart Learning Mode - Lựa chọn thông minh
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    ⚡ Quick Practice Mode - All Cards
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg px-4 py-2 flex flex-col items-center">
                <div className="text-sm text-gray-600">Tiến độ</div>
                <div className="text-xl font-bold text-blue-600">
                  {Math.round(((index + 1) / flashcards.length) * 100)}%
                </div>
                {isSmartMode && (
                  <div className="text-xs text-purple-600 mt-1">
                    🧠 Đã review: {reviewedCards.size}/{flashcards.length}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Thẻ {index + 1} / {flashcards.length}
              </span>
              <span className="text-gray-600">
                {Object.keys(cardRatings).length} đã đánh giá
              </span>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation]}
            spaceBetween={50}
            slidesPerView={1}
            centeredSlides={true}
            allowTouchMove={true}
            grabCursor={true}
            speed={300}
            onSlideChange={handleSlideChange}
            navigation={false}
            className="w-full h-[420px] py-5"
          >
            {flashcards.map((card) => (
              <SwiperSlide key={card.id} className="flex justify-center items-center">
                <div style={{ perspective: '1000px' }} className="w-full relative">
                  <Card
                    onClick={handleCardFlip}
                    className="cursor-pointer relative shadow-xl hover:shadow-2xl border-0"
                    style={{
                      height: '420px',
                      minHeight: '420px'
                    }}
                  >
                    {!flipped ? (
                      <div
                        className="absolute inset-0 flex flex-col justify-center items-center text-center p-8"
                        style={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          borderRadius: '8px'
                        }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                          <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                          <div className="absolute top-12 right-8 w-8 h-8 bg-white/15 rounded-full blur-lg"></div>
                          <div className="absolute bottom-6 left-8 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
                          <div className="absolute bottom-16 right-4 w-6 h-6 bg-white/20 rounded-full blur-md"></div>
                        </div>

                        <div className="absolute top-4 right-4 z-10">
                          <Button
                            type="text"
                            icon={<SoundOutlined className="text-white" />}
                            onClick={(e) => { e.stopPropagation(); handlePlaySound(card.front); }}
                            className="text-white hover:bg-white/20 backdrop-blur-sm"
                            size="large"
                          />
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                          <h2 className="text-6xl font-bold text-white mb-6 drop-shadow-lg tracking-wide">
                            {card.front}
                          </h2>

                          {card.type && (
                            <div className="mb-4">
                              <span className="inline-block text-white/90 text-base font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-lg">
                                {card.type}
                              </span>
                            </div>
                          )}

                          {card.phonetic && (
                            <div className="mb-6">
                              <Button
                                type="text"
                                onClick={(e) => { e.stopPropagation(); toggleHint(card.id); }}
                                className="text-white hover:bg-white/20 border border-white/30 rounded-full px-6 py-3 transition-all duration-200 backdrop-blur-sm shadow-lg"
                                size="middle"
                                icon={showHint[card.id] ? <EyeInvisibleOutlined /> : <BulbOutlined />}
                              >
                                {showHint[card.id] ? 'Ẩn gợi ý' : 'Gợi ý'}
                              </Button>
                              {showHint[card.id] && (
                                <div className="mt-4 mx-auto max-w-md animate-fadeIn">
                                  <div className="px-6 py-4 rounded-2xl bg-white/25 backdrop-blur-md border border-white/40 shadow-xl">
                                    <p className="text-white/95 font-medium text-lg text-center m-0">
                                      💡 {card.phonetic}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <p className="text-white/80 text-sm select-none pointer-events-none">
                              👆 Click để xem nghĩa
                            </p>
                            <div className="w-16 h-1 bg-white/40 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="absolute inset-0 flex flex-col justify-center items-center text-center p-8"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '8px'
                        }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                          <div className="absolute top-6 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                          <div className="absolute top-16 left-6 w-10 h-10 bg-white/15 rounded-full blur-lg"></div>
                          <div className="absolute bottom-8 right-8 w-14 h-14 bg-white/10 rounded-full blur-xl"></div>
                          <div className="absolute bottom-20 left-4 w-8 h-8 bg-white/20 rounded-full blur-md"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center max-w-2xl">
                          <h3 className="text-6xl font-semibold text-white mb-8 drop-shadow-lg tracking-wide">
                            {card.back}
                          </h3>

                          {card.example && card.example[0] && (
                            <div className="mb-6 w-full max-w-lg">
                              <div className="px-6 py-5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl text-left">
                                <h4 className="text-white/90 text-sm font-semibold mb-4 uppercase tracking-wide flex items-center">
                                  <span className="inline-block w-2 h-2 bg-white/60 rounded-full mr-2"></span>
                                  Ví dụ
                                </h4>
                                <div className="space-y-3">
                                  <p className="text-white/95 italic text-base md:text-lg leading-relaxed">
                                    📝 "{card.example[0]}"
                                  </p>
                                  {card.example[1] && (
                                    <p className="text-white/85 text-base md:text-lg leading-relaxed">
                                      📖 "{card.example[1]}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <p className="text-white/80 text-sm select-none pointer-events-none">
                              👆 Click để xem từ
                            </p>
                            <div className="w-16 h-1 bg-white/40 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Button
            icon={<LeftOutlined />}
            size="large"
            disabled={index === 0}
            onClick={handlePrevious}
            className="px-8"
          >
            Trước
          </Button>

          <Button
            onClick={handleCardFlip}
            size="large"
            type="primary"
            className="px-8"
          >
            {flipped ? 'Xem từ' : 'Xem nghĩa'}
          </Button>

          <Button
            icon={<RightOutlined />}
            size="large"
            disabled={index === flashcards.length - 1}
            onClick={handleNext}
            className="px-8"
          >
            Sau
          </Button>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          {isSmartMode && isUserDeck && flashcards[index] && (
            <div className="text-center mb-4">
              {reviewedCards.has(flashcards[index].id) ? (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  ✅ Đã review - Hệ thống đã ghi nhận
                </div>
              ) : (
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  🧠 Đánh giá để hệ thống học hỏi
                </div>
              )}
            </div>
          )}

          {!isUserDeck && (
            <div className="text-center mb-4">
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                ℹ️ Deck mặc định - Chỉ có thể thêm vào My List
              </div>
            </div>
          )}

          {isUserDeck && !isSmartMode && (
            <div className="text-center mb-4">
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                📚 Deck cá nhân - Đánh giá để cải thiện việc học
              </div>
            </div>
          )}

          <div className="flex justify-center gap-6 ">
            {isUserDeck && isSmartMode && (
              <>
                <Button
                  type={cardRatings[flashcards[index]?.id] === 'easy' ? 'primary' : 'default'}
                  icon={<SmileOutlined />}
                  size="large"
                  onClick={() => handleDifficultyRating(flashcards[index]?.id, 'easy')}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white border-0"
                >
                  Dễ
                </Button>

                <Button
                  type={cardRatings[flashcards[index]?.id] === 'medium' ? 'primary' : 'default'}
                  icon={<MehOutlined />}
                  size="large"
                  onClick={() => handleDifficultyRating(flashcards[index]?.id, 'medium')}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white border-0"
                >
                  Trung bình
                </Button>

                <Button
                  type={cardRatings[flashcards[index]?.id] === 'hard' ? 'primary' : 'default'}
                  icon={<FrownOutlined />}
                  size="large"
                  onClick={() => handleDifficultyRating(flashcards[index]?.id, 'hard')}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white border-0"
                >
                  Khó
                </Button>
              </>
            )}

            {!isUserDeck && (
              <Button
                type={favoriteCards.has(flashcards[index]?.id) ? 'primary' : 'default'}
                icon={favoriteCards.has(flashcards[index]?.id) ? <HeartOutlined /> : <PlusOutlined />}
                size="large"
                onClick={() => handleAddToFavorites(flashcards[index]?.id)}
                className={`flex items-center gap-2 ${favoriteCards.has(flashcards[index]?.id)
                  ? 'bg-red-500 hover:bg-red-600 text-white border-0'
                  : 'bg-blue-500 hover:bg-blue-600 text-white border-0'
                  }`}
              >
                {favoriteCards.has(flashcards[index]?.id) ? 'Đã thêm vào my list' : 'Thêm vào my list'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {!isUserDeck && (
        <AddToMyListModal
          open={showAddToMyListModal}
          onClose={() => {
            setShowAddToMyListModal(false);
            setSelectedCard(null);
          }}
          defaultCard={selectedCard}
          defaultDeckId={deckId}
        />
      )}
    </div>
  );
}
