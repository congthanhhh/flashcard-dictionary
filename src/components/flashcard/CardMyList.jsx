import { FileTextOutlined, LoadingOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Spin } from 'antd'
import { useNavigate } from 'react-router-dom';
import PaginationFC from './PaginationFC';
import { useEffect, useState } from 'react';
import { getUserDecks } from '../../service/deck';

const CardMyList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [decks, setDecks] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalDecks: 0
    });
    const PAGE_SIZE = 8;

    useEffect(() => {
        loadUserDecks(1);
    }, []);

    const loadUserDecks = async (page = 1, limit = PAGE_SIZE) => {
        try {
            setLoading(true);
            const response = await getUserDecks(page, limit);

            setDecks(response.decks || []);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalDecks: response.totalDecks
            });

            console.log('User decks loaded:', response);
        } catch (error) {
            console.error('Error loading user decks:', error);
            // Thêm xử lý lỗi để hiển thị thông báo cho người dùng
            if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                // Redirect to login if unauthorized
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        loadUserDecks(page);
    };

    const handleCardClick = (deckId) => {
        navigate(`/card-detail/${deckId}`, {
            state: { isUserDeck: true }
        });
    };

    // Hiển thị thông báo khi không có deck
    if (!loading && decks.length === 0) {
        return (
            <div className="max-w-screen-xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Deck của tôi</h1>
                    <p className="text-gray-600">Quản lý các bộ flashcard cá nhân của bạn</p>
                </div>
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        Bạn chưa có deck nào
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Khám phá deck có sẵn
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-screen-xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Deck của tôi</h1>
                <p className="text-gray-600">Quản lý các bộ flashcard cá nhân của bạn</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: PAGE_SIZE }, (_, index) => (
                        <Card
                            key={index}
                            loading={true}
                            className="shadow-lg bg-slate-100"
                        />
                    ))
                ) : (
                    decks.map((deck) => (
                        <Card
                            loading={loading}
                            key={deck._id}
                            onClick={() => handleCardClick(deck._id)}
                            className="shadow-lg bg-slate-100
                    cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                            cover={
                                <div className="h-32 overflow-hidden">
                                    <img
                                        alt={deck.name}
                                        src={deck.url || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";
                                        }}
                                    />
                                </div>
                            }
                        >
                            <div className="">
                                <h3 className="text-base font-semibold text-gray-800 line-clamp-3 mb-2 leading-tight capitalize">
                                    {deck.name}
                                </h3>
                                <div className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-[40px]">
                                    {deck.description}
                                </div>
                                <div className="text-gray-500 font-medium flex">
                                    <div>
                                        <FileTextOutlined />
                                        {deck.size} từ
                                    </div>
                                    <div className='mx-2'>|</div>
                                    <div>
                                        <UserOutlined />
                                        Private
                                    </div>
                                </div>
                            </div>
                        </Card>

                    ))

                )}
            </div>
            {!loading && pagination.totalPages > 1 && (
                <PaginationFC
                    current={pagination.currentPage}
                    total={pagination.totalDecks}
                    pageSize={PAGE_SIZE}
                    onChange={handlePageChange}
                />
            )}
        </div>
    )
}

export default CardMyList