import { FileTextOutlined, LoadingOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Card, Spin } from 'antd'
import { useNavigate } from 'react-router-dom';
import PaginationFC from './PaginationFC';
import { useEffect, useState } from 'react';
import { getDefaultDecks } from '../../service/deck';

const CardMain = () => {
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
        loadDefaultDecks(1);
    }, []);

    const loadDefaultDecks = async (page = 1, limit = PAGE_SIZE) => {
        try {
            setLoading(true);
            const response = await getDefaultDecks(page, limit);

            setDecks(response.decks || []);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalDecks: response.totalDecks
            });

            console.log('Default decks loaded:', response);
        } catch (error) {
            console.error('Error loading default decks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        loadDefaultDecks(page);
    };

    const handleCardClick = (deckId) => {
        navigate(`/card-detail/${deckId}`);
    };

    return (
        <div className="max-w-screen-xl mx-auto p-6">
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
                                        <UsergroupAddOutlined />
                                        Public
                                    </div>
                                </div>
                            </div>
                        </Card>

                    ))

                )}
            </div>
            {pagination.totalPages > 1 && (
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

export default CardMain