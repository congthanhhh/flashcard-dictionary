import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Progress, message, Radio, Input, Spin } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    CheckCircleOutlined,
    SmileOutlined,
    MehOutlined,
    FrownOutlined
} from '@ant-design/icons';
import { createUserDeckReviewSession, createDefaultDeckReviewSession } from '../../service/deck';
import { submitCardReview } from '../../service/card';

const ReviewSession = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentType, setCurrentType] = useState('flashcard');
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [isUserDeck, setIsUserDeck] = useState(location.state?.isUserDeck || false);
    const [allQuestions, setAllQuestions] = useState([]);

    const sessionConfig = location.state?.sessionConfig;

    useEffect(() => {
        if (sessionConfig) {
            createSession();
        } else {
            message.error('Không có cấu hình phiên luyện tập');
            navigate(-1);
        }
    }, []);

    const createSession = async () => {
        try {
            setLoading(true);
            let response;

            if (isUserDeck) {
                response = await createUserDeckReviewSession(deckId, sessionConfig);
            } else {
                response = await createDefaultDeckReviewSession(deckId, sessionConfig);
            }

            setSessionData(response);

            // Tạo danh sách câu hỏi theo thứ tự
            const questions = [];

            // Thêm flashcards
            response.flashcard?.forEach((card, index) => {
                questions.push({
                    type: 'flashcard',
                    index,
                    data: card
                });
            });

            // Thêm MCQ
            response.mcq?.forEach((question, index) => {
                questions.push({
                    type: 'mcq',
                    index,
                    data: question
                });
            });

            // Thêm Fill in the Blank
            response.fillInTheBlank?.forEach((question, index) => {
                questions.push({
                    type: 'fillInTheBlank',
                    index,
                    data: question
                });
            });

            setAllQuestions(questions);
            message.success(`Đã tạo phiên luyện tập với ${questions.length} câu hỏi`);
        } catch (error) {
            console.error('Error creating session:', error);
            message.error('Không thể tạo phiên luyện tập');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < allQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleAnswer = (questionKey, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionKey]: answer
        }));
    };

    const handleSubmitSession = async () => {
        try {
            setLoading(true);

            // Submit review cho từng card (chỉ với user deck)
            if (isUserDeck) {
                for (const question of allQuestions) {
                    if (question.type === 'flashcard') {
                        const cardId = question.data._id;
                        const questionKey = `${question.type}_${question.index}`;
                        const difficulty = userAnswers[questionKey] || 'medium';

                        await submitCardReview(cardId, {
                            retrievalLevel: difficulty,
                            hintWasShown: false
                        });
                    }
                }
            }

            setShowResults(true);
            message.success('Đã hoàn thành phiên luyện tập!');
        } catch (error) {
            console.error('Error submitting session:', error);
            message.error('Có lỗi khi submit kết quả');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" tip="Đang tạo phiên luyện tập..." />
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Hoàn thành phiên luyện tập!</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Bạn đã hoàn thành {allQuestions.length} câu hỏi
                    </p>
                    <div className="space-x-4">
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate(`/card-detail/${deckId}`, {
                                state: { isUserDeck }
                            })}
                        >
                            Quay lại Deck
                        </Button>
                        <Button
                            size="large"
                            onClick={() => navigate('/my-list')}
                        >
                            Về trang chủ
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!allQuestions.length) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <h2>Không có câu hỏi nào</h2>
                <Button onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
        );
    }

    const currentQuestion = allQuestions[currentIndex];
    const questionKey = `${currentQuestion.type}_${currentQuestion.index}`;
    const progress = ((currentIndex + 1) / allQuestions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <Button
                        icon={<LeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </Button>
                    <h1 className="text-2xl font-bold">Phiên luyện tập</h1>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">
                            Câu {currentIndex + 1} / {allQuestions.length}
                        </div>
                        <div className="text-lg font-bold">
                            {Math.round(progress)}%
                        </div>
                    </div>
                </div>
                <Progress percent={progress} showInfo={false} />
            </div>

            {/* Question Content */}
            <Card className="mb-6 min-h-[400px]">
                {currentQuestion.type === 'flashcard' && (
                    <FlashcardQuestion
                        data={currentQuestion.data}
                        onAnswer={(answer) => handleAnswer(questionKey, answer)}
                        currentAnswer={userAnswers[questionKey]}
                    />
                )}

                {currentQuestion.type === 'mcq' && (
                    <MCQQuestion
                        data={currentQuestion.data}
                        onAnswer={(answer) => handleAnswer(questionKey, answer)}
                        currentAnswer={userAnswers[questionKey]}
                    />
                )}

                {currentQuestion.type === 'fillInTheBlank' && (
                    <FillInTheBlankQuestion
                        data={currentQuestion.data}
                        onAnswer={(answer) => handleAnswer(questionKey, answer)}
                        currentAnswer={userAnswers[questionKey]}
                    />
                )}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    icon={<LeftOutlined />}
                    disabled={currentIndex === 0}
                    onClick={handlePrevious}
                >
                    Câu trước
                </Button>

                {currentIndex === allQuestions.length - 1 ? (
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSubmitSession}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Hoàn thành
                    </Button>
                ) : (
                    <Button
                        icon={<RightOutlined />}
                        onClick={handleNext}
                    >
                        Câu sau
                    </Button>
                )}
            </div>
        </div>
    );
};

// Sub-components for different question types
const FlashcardQuestion = ({ data, onAnswer, currentAnswer }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="text-center">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">🃏 Flashcard</h3>
                <p className="text-gray-600">Xem từ và đánh giá mức độ nhớ của bạn</p>
            </div>

            <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg cursor-pointer mb-6"
                onClick={() => setFlipped(!flipped)}
            >
                {!flipped ? (
                    <div>
                        <h2 className="text-4xl font-bold mb-4">{data.name}</h2>
                        <p className="text-lg opacity-80">👆 Click để xem nghĩa</p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-4xl font-bold mb-4">{data.definition}</h2>
                        <p className="text-lg opacity-80">👆 Click để xem từ</p>
                    </div>
                )}
            </div>

            {flipped && (
                <div>
                    <p className="mb-4 text-gray-600">Bạn có nhớ từ này không?</p>
                    <Radio.Group
                        value={currentAnswer}
                        onChange={(e) => onAnswer(e.target.value)}
                        size="large"
                    >
                        <Radio.Button value="easy" className="bg-green-50">
                            <SmileOutlined className="text-green-500" /> Dễ
                        </Radio.Button>
                        <Radio.Button value="medium" className="bg-yellow-50">
                            <MehOutlined className="text-yellow-500" /> Trung bình
                        </Radio.Button>
                        <Radio.Button value="hard" className="bg-red-50">
                            <FrownOutlined className="text-red-500" /> Khó
                        </Radio.Button>
                    </Radio.Group>
                </div>
            )}
        </div>
    );
};

const MCQQuestion = ({ data, onAnswer, currentAnswer }) => {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">❓ Trắc nghiệm</h3>
                <p className="text-gray-600">Chọn nghĩa đúng của từ</p>
            </div>

            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">{data.prompt}</h2>
            </div>

            <Radio.Group
                value={currentAnswer}
                onChange={(e) => onAnswer(e.target.value)}
                className="w-full"
            >
                <div className="space-y-3">
                    {data.options.map((option, index) => (
                        <Radio
                            key={index}
                            value={option}
                            className="w-full p-4 border rounded-lg hover:bg-gray-50"
                        >
                            <span className="text-lg">{option}</span>
                        </Radio>
                    ))}
                </div>
            </Radio.Group>
        </div>
    );
};

const FillInTheBlankQuestion = ({ data, onAnswer, currentAnswer }) => {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">✏️ Điền từ</h3>
                <p className="text-gray-600">Nhập nghĩa tiếng Việt của từ</p>
            </div>

            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">{data.prompt}</h2>
            </div>

            <div className="max-w-md mx-auto">
                <Input
                    placeholder="Nhập nghĩa tiếng Việt..."
                    value={currentAnswer || ''}
                    onChange={(e) => onAnswer(e.target.value)}
                    size="large"
                    className="text-center text-lg"
                />
            </div>
        </div>
    );
};

export default ReviewSession;