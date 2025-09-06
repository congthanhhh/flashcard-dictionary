import React, { useEffect, useState } from 'react'
import { Card, Button, Modal, message } from 'antd'
import { SoundOutlined, SwapOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PaginationFC from './PaginationFC';
import NewCardSimple from '../CardModal/NewCardSimple';
import AddToMyListModal from '../CardModal/AddToMyListModal';
import { deleteCard } from '../../service/card';
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
    const [showNewCardModal, setShowNewCardModal] = useState(false);
    const [showEditCardModal, setShowEditCardModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingCard, setDeletingCard] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showAddToMyListModal, setShowAddToMyListModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

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

    const handleCardCreated = (newCard) => {
        // Refresh the cards list
        loadCards(1);
    };

    const handleEditCard = (card) => {
        setEditingCard(card);
        setShowEditCardModal(true);
    };

    const handleCardUpdated = (updatedCard) => {
        // Refresh the cards list
        loadCards(pagination.currentPage);
        setEditingCard(null);
    };

    const handleDeleteCard = (card) => {
        setDeletingCard(card);
        setShowDeleteModal(true);
    };

    const confirmDeleteCard = async () => {
        if (!deletingCard) return;

        try {
            setDeleteLoading(true);
            await deleteCard(deletingCard._id);
            message.success('Xóa thẻ thành công!');

            // Refresh cards list
            const currentPageCards = cards.length;
            if (currentPageCards === 1 && pagination.currentPage > 1) {
                loadCards(pagination.currentPage - 1);
            } else {
                loadCards(pagination.currentPage);
            }

            setShowDeleteModal(false);
            setDeletingCard(null);
        } catch (error) {
            console.error('Error deleting card:', error);
            message.error(error.message || 'Không thể xóa thẻ');
        } finally {
            setDeleteLoading(false);
        }
    };

    const cancelDeleteCard = () => {
        setShowDeleteModal(false);
        setDeletingCard(null);
    };

    const handleAddToMyList = (card) => {
        setSelectedCard(card);
        setShowAddToMyListModal(true);
    };

    return (
        <div className="max-w-screen-xl mx-auto p-6">
            <div className="max-w-4xl mx-auto">
                <div className='text-2xl font-bold p-2 uppercase flex items-center gap-3'>
                    Flashcards: {deck?.name}
                    {isUserDeck && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded normal-case">
                                Deck cá nhân
                            </span>
                            <Button
                                type="primary"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => setShowNewCardModal(true)}
                                className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 normal-case"
                            >
                                Thêm thẻ
                            </Button>
                        </div>
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
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-3">
                                                <h1 className="text-3xl font-bold text-gray-800">{card.name}</h1>
                                                <span className="text-gray-600 text-lg">({card.word_type})</span>
                                                {/* <span className="text-blue-600 text-lg font-mono">/ ˈæbsənt/</span> */}
                                                <Button
                                                    type="text"
                                                    icon={<SoundOutlined />}
                                                    className="text-blue-500 hover:bg-blue-50"
                                                    size="small"
                                                />
                                            </div>

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
                                        />
                                    </div>
                                    {isUserDeck ? (
                                        <div className="flex justify-end">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => handleEditCard(card)}
                                                className="text-blue-500 hover:bg-blue-50"
                                                size="large"
                                                title="Chỉnh sửa thẻ"
                                            />
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDeleteCard(card)}
                                                className="text-red-500 hover:bg-red-50"
                                                size="large"
                                                title="Xóa thẻ"
                                            />

                                        </div>
                                    ) : (
                                        <div className="flex justify-end mt-4">
                                            <Button
                                                variant='filled'
                                                icon={<PlusOutlined />}
                                                onClick={() => handleAddToMyList(card)}
                                                className="text-blue-500 hover:bg-blue-600"
                                                size="large"
                                            > List
                                            </Button>
                                        </div>
                                    )}
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

            {/* New Card Modal */}
            <NewCardSimple
                open={showNewCardModal}
                onClose={() => setShowNewCardModal(false)}
                onSuccess={handleCardCreated}
                deckId={deckId}
            />

            {/* Edit Card Modal */}
            <NewCardSimple
                open={showEditCardModal}
                onClose={() => {
                    setShowEditCardModal(false);
                    setEditingCard(null);
                }}
                onSuccess={handleCardUpdated}
                deckId={deckId}
                editCard={editingCard}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg">
                        <ExclamationCircleOutlined className="text-red-500" />
                        <span>Xác nhận xóa thẻ</span>
                    </div>
                }
                open={showDeleteModal}
                onCancel={cancelDeleteCard}
                footer={[
                    <Button key="cancel" onClick={cancelDeleteCard}>
                        Hủy
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        loading={deleteLoading}
                        onClick={confirmDeleteCard}
                    >
                        {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                ]}
                centered
                width={500}
            >
                {deletingCard && (
                    <div>
                        <p className="mb-3">Bạn có chắc chắn muốn xóa thẻ này không?</p>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="font-semibold text-gray-800 text-lg mb-2">
                                {deletingCard.name}
                                <span className="ml-2 text-gray-600 text-base font-normal">
                                    ({deletingCard.word_type})
                                </span>
                            </div>
                            <div className="text-gray-600 text-sm">
                                {deletingCard.definition}
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                            <ExclamationCircleOutlined />
                            <span>Hành động này không thể hoàn tác!</span>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add To My List Modal */}
            <AddToMyListModal
                open={showAddToMyListModal}
                onClose={() => {
                    setShowAddToMyListModal(false);
                    setSelectedCard(null);
                }}
                defaultCard={selectedCard}
                defaultDeckId={deckId}
            />
        </div>
    )
}

export default CardDetail