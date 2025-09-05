import React, { useEffect, useState } from 'react'
import { Card, Button } from 'antd'
import { SoundOutlined, SwapOutlined } from '@ant-design/icons'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PaginationFC from './PaginationFC';
import {
    getDefaultDeckCards,
    getDefaultDeckId,
    getUserDeckCards,
    getUserDeckById
} from '../../service/deck';

const CardDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { deckId } = useParams();
    const [loading, setLoading] = useState(true);
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    // Khởi tạo isUserDeck ngay từ đầu dựa trên location state
    const [isUserDeck, setIsUserDeck] = useState(location.state?.isUserDeck || false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCards: 0
    });
    const PAGE_SIZE = 5;

    // Cập nhật isUserDeck nếu location state thay đổi
    useEffect(() => {
        const newIsUserDeck = location.state?.isUserDeck || false;
        if (newIsUserDeck !== isUserDeck) {
            console.log('Location state changed - updating isUserDeck to:', newIsUserDeck);
            setIsUserDeck(newIsUserDeck);
            // Reload data with new deck type
            if (deckId) {
                loadCards();
                loadDeckInfo();
            }
        }
    }, [location.state?.isUserDeck]);

    // Load data khi có deckId
    useEffect(() => {
        if (deckId) {
            console.log('Initial load - isUserDeck:', isUserDeck, 'deckId:', deckId);
            loadCards();
            loadDeckInfo();
        }
    }, [deckId]); // Chỉ dependency là deckId

    const loadDeckInfo = async () => {
        try {
            console.log('Loading deck info - isUserDeck:', isUserDeck, 'deckId:', deckId);
            let deckInfo;
            if (isUserDeck) {
                deckInfo = await getUserDeckById(deckId);
            } else {
                deckInfo = await getDefaultDeckId(deckId);
            }
            setDeck(deckInfo);
        } catch (error) {
            console.error('Error loading deck info:', error);
        }
    };

    const loadCards = async (page = 1, limit = PAGE_SIZE) => {
        try {
            setLoading(true);
            console.log('Loading cards - isUserDeck:', isUserDeck, 'deckId:', deckId, 'page:', page);
            let response;

            if (isUserDeck) {
                response = await getUserDeckCards(deckId, page, limit);
            } else {
                response = await getDefaultDeckCards(deckId, page, limit);
            }

            setCards(response.cards || []);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalCards: response.totalCards
            });
        } catch (error) {
            console.error('Error loading deck cards:', error);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (page) => {
        loadCards(page);
    };

    return (
        <div className="max-w-screen-xl mx-auto p-6">
            <div className="max-w-4xl mx-auto">
                <div className='text-2xl font-bold p-2 uppercase flex items-center gap-3'>
                    Flashcards: {deck?.name}
                    {isUserDeck && (
                        <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded normal-case">
                            Deck cá nhân
                        </span>
                    )}
                    {!isUserDeck && (
                        <span className="text-sm bg-green-500 text-white px-2 py-1 rounded normal-case">
                            Deck mặc định
                        </span>
                    )}
                </div>
                <br />
                <div className='w-full'>
                    <Button
                        onClick={() => {
                            console.log('CardDetail - Navigating to flashcard with isUserDeck:', isUserDeck);
                            navigate(`/flashcard/${deckId}`, {
                                state: {
                                    isUserDeck: isUserDeck,
                                    debug: true
                                }
                            });
                        }}
                        color='primary'
                        variant='filled'
                        size='large'
                        className='w-full font-semibold'
                    >
                        Luyện tập flashcards (tất cả) - {isUserDeck ? 'User Deck' : 'Default Deck'}
                    </Button>
                </div>
                <br />
                <Button color='blue' variant='link' size='large' className='font-semibold'>
                    <SwapOutlined />
                    <p>Xem ngẫu nhiên 20 từ</p>
                </Button>
                <p className='text-lg font-medium p-2'>
                    List có {deck?.size} từ {pagination.totalCards > 0 && `(Hiển thị ${pagination.totalCards} thẻ)`}
                </p>

                {/* Hiển thị thông báo khi không có cards */}
                {!loading && cards.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">
                            Deck này chưa có thẻ nào
                        </div>
                        <Button
                            onClick={() => navigate(-1)}
                            type="primary"
                        >
                            Quay lại
                        </Button>
                    </div>
                )}

                {loading ? (
                    Array.from({ length: PAGE_SIZE }, (_, index) => (
                        <Card
                            key={index}
                            loading={true}
                            className="shadow-lg border border-gray-200 rounded-lg overflow-hidden my-4"
                        />
                    ))
                ) : (
                    cards.length > 0 && cards.map((card) =>
                        <Card key={card._id}
                            className="shadow-lg border border-gray-200 rounded-lg overflow-hidden my-4">
                            <div className="flex flex-col lg:flex-row">
                                <div className="flex-1">
                                    <div className="mb-3">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="text-3xl font-bold text-gray-800">{card.name}</h1>
                                            <span className="text-gray-600 text-lg">({card.word_type})</span>
                                            {/* <span className="text-blue-600 text-lg font-mono">/ ˈæbsənt/</span> */}
                                            {/* <Button
                                            type="text"
                                            icon={<SoundOutlined />}
                                            className="text-blue-500 hover:bg-blue-50"
                                            size="small"
                                        /> */}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Định nghĩa:</h3>
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            {card.definition}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ví dụ:</h3>
                                        <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                                            {card.example && card.example.length > 0 ? (
                                                <>
                                                    <p className="text-gray-800 mb-1 text-base italic">
                                                        "{card.example[0]}"
                                                    </p>
                                                    {card.example[1] && (
                                                        <p className="text-gray-700 text-base italic">
                                                            "{card.example[1]}"
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-gray-500 text-base italic">
                                                    Chưa có ví dụ
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-80 w-full">
                                    <div className="h-40 lg:h-40">
                                        <img
                                            src={card.url || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
                                            alt={card.name || "Card image"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                )}
                <br />
                {!loading && pagination.totalPages > 1 && (
                    <PaginationFC
                        current={pagination.currentPage}
                        total={pagination.totalCards}
                        pageSize={PAGE_SIZE}
                        onChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    )
}

export default CardDetail