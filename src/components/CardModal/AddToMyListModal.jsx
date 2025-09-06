import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Empty, Spin } from 'antd';
import { FolderOutlined, PlusOutlined } from '@ant-design/icons';
import { getUserDecks, addDefaultCardToPersonalDeck } from '../../service/deck';

const { Option } = Select;

const AddToMyListModal = ({ open, onClose, defaultCard, defaultDeckId }) => {
    const [loading, setLoading] = useState(false);
    const [userDecks, setUserDecks] = useState([]);
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [addLoading, setAddLoading] = useState(false);
    const [decksLoading, setDecksLoading] = useState(false);

    useEffect(() => {
        if (open) {
            loadUserDecks();
            setSelectedDeckId(null);
        }
    }, [open]);

    const loadUserDecks = async () => {
        try {
            setDecksLoading(true);
            const response = await getUserDecks(1, 100); // Lấy tất cả deck
            setUserDecks(response.decks || []);
        } catch (error) {
            console.error('Error loading user decks:', error);
            message.error('Không thể tải danh sách deck của bạn');
        } finally {
            setDecksLoading(false);
        }
    };

    const handleAddCard = async () => {
        if (!selectedDeckId) {
            message.warning('Vui lòng chọn deck để thêm thẻ!');
            return;
        }

        try {
            setAddLoading(true);
            await addDefaultCardToPersonalDeck(selectedDeckId, [defaultCard._id]);

            const selectedDeck = userDecks.find(deck => deck._id === selectedDeckId);
            message.success(`Đã thêm thẻ "${defaultCard.name}" vào deck "${selectedDeck?.name}"`);

            onClose();
        } catch (error) {
            console.error('Error adding card to deck:', error);
            message.error(error.message || 'Không thể thêm thẻ vào deck');
        } finally {
            setAddLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedDeckId(null);
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <PlusOutlined className="text-blue-500" />
                    <span>Thêm thẻ vào My List</span>
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button
                    key="add"
                    type="primary"
                    loading={addLoading}
                    onClick={handleAddCard}
                    disabled={!selectedDeckId}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    {addLoading ? 'Đang thêm...' : 'Thêm thẻ'}
                </Button>
            ]}
            centered
            width={600}
        >
            <div className="space-y-4">
                {/* Card Preview */}
                {defaultCard && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-sm font-semibold text-gray-700 mb-2">📋 Thẻ sẽ được thêm:</div>
                        <div className="bg-white rounded-lg p-3 border">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-800 text-lg">{defaultCard.name}</h3>
                                {defaultCard.word_type && (
                                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        {defaultCard.word_type}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm">{defaultCard.definition}</p>
                        </div>
                    </div>
                )}

                {/* Deck Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chọn deck để thêm thẻ:
                    </label>

                    {decksLoading ? (
                        <div className="flex justify-center py-8">
                            <Spin size="large" />
                        </div>
                    ) : userDecks.length === 0 ? (
                        <Empty
                            image={<FolderOutlined className="text-4xl text-gray-300" />}
                            imageStyle={{ height: 60 }}
                            description={
                                <div className="text-gray-500">
                                    <p>Bạn chưa có deck nào</p>
                                    <p className="text-sm">Hãy tạo deck đầu tiên trong "Deck của tôi"</p>
                                </div>
                            }
                        />
                    ) : (
                        <Select
                            placeholder="Chọn deck để thêm thẻ..."
                            value={selectedDeckId}
                            onChange={setSelectedDeckId}
                            className="w-full"
                            size="large"
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {userDecks.map(deck => (
                                <Option key={deck._id} value={deck._id}>
                                    <div className="flex items-center justify-between">
                                        <div className=''>
                                            <div className="font-medium">{deck.name}</div>
                                        </div>
                                        <div className="text-xs text-gray-500">{deck.size} thẻ</div>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    )}
                </div>

                {/* Selection Info */}
                {selectedDeckId && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-sm text-green-700">
                            ✓ Thẻ sẽ được thêm vào deck: <strong>
                                {userDecks.find(deck => deck._id === selectedDeckId)?.name}
                            </strong>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddToMyListModal;
