import React, { useEffect, useState } from 'react'
import { Card, Button } from 'antd'
import { SoundOutlined, SwapOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom';
import PaginationFC from './PaginationFC';
import { getDefaultDeckCards, getDefaultDeckId } from '../../service/deck';

const CardDetail = () => {
    const navigate = useNavigate();
    const { deckId } = useParams();
    const [loading, setLoading] = useState(true);
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCards: 0
    });
    const PAGE_SIZE = 5;

    const loadDeckInfo = async () => {
        try {
            const deckInfo = await getDefaultDeckId(deckId);
            setDeck(deckInfo);
        } catch (error) {
            console.error('Error loading deck info:', error);
        }
    };

    const loadCards = async (page = 1, limit = PAGE_SIZE) => {
        try {
            setLoading(true);
            const response = await getDefaultDeckCards(deckId, page, limit);
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



    useEffect(() => {
        if (deckId) {
            loadCards();
            loadDeckInfo();
        }
    }, [deckId]);

    return (
        <div className="max-w-screen-xl mx-auto p-6">
            <div className="max-w-4xl mx-auto">
                <div className='text-2xl font-bold p-2 uppercase'>
                    Flashcards: {deck?.name}
                </div>
                <br />
                <div className='w-full'>
                    <Button onClick={() => navigate(`/flashcard/${deckId}`)}
                        color='primary' variant='filled' size='large' className='w-full font-semibold'>Luyện tập flashcards (tất cả)</Button>
                </div>
                <br />
                <Button color='blue' variant='link' size='large' className='font-semibold'>
                    <SwapOutlined />
                    <p>Xem ngẫu nhiên 20 từ</p>
                </Button>
                <p className='text-lg font-medium p-2'>List có {deck?.size} từ</p>
                {loading ? (
                    Array.from({ length: PAGE_SIZE }, (_, index) => (
                        <Card
                            key={index}
                            loading={true}
                            className="shadow-lg border border-gray-200 rounded-lg overflow-hidden my-4"
                        />
                    ))
                ) : (

                    cards.map((card) =>
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
                                            <p className="text-gray-800 mb-1 text-base italic">
                                                "{card.example[0]}"
                                            </p>
                                            <p className="text-gray-700 text-base italic">
                                                "{card.example[1]}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-80 w-full">
                                    <div className="h-40 lg:h-40">
                                        <img
                                            src={card.url}
                                            alt="Empty classroom desks"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                )}
                <br />
                {pagination.totalPages > 1 && (
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