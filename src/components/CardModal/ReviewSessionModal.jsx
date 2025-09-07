import React, { useState } from 'react';
import { Modal, Form, InputNumber, Button, message, Divider } from 'antd';
import { PlayCircleOutlined, BookOutlined } from '@ant-design/icons';

const ReviewSessionModal = ({ open, onClose, onStartSession, deckName, deckSize, isUserDeck }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const sessionConfig = {
                flashcard: values.flashcard || 0
            };

            // Validate total không vượt quá deck size
            const total = sessionConfig.flashcard;
            if (total > deckSize) {
                message.warning(`Tổng số thẻ không được vượt quá ${deckSize} thẻ có trong deck`);
                return;
            }

            if (total === 0) {
                message.warning('Vui lòng chọn ít nhất 1 thẻ để luyện tập');
                return;
            }

            onStartSession(sessionConfig);
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Error creating session:', error);
            message.error('Không thể tạo phiên luyện tập');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-xl font-bold">
                    <PlayCircleOutlined className="text-blue-500" />
                    <span>Cấu hình phiên luyện tập</span>
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
        >
            <div className="space-y-4">
                {/* Deck Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOutlined className="text-blue-500" />
                        <span className="font-semibold text-gray-700">Deck:</span>
                        <span className="font-bold text-blue-600">{deckName}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        <span>Loại: </span>
                        <span className={`font-medium ${isUserDeck ? 'text-blue-600' : 'text-green-600'}`}>
                            {isUserDeck ? 'Deck cá nhân' : 'Deck mặc định'}
                        </span>
                        <span className="ml-4">Tổng thẻ: </span>
                        <span className="font-bold">{deckSize} thẻ</span>
                    </div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        flashcard: 10
                    }}
                >
                    {/* Flashcard */}
                    <Form.Item
                        label={
                            <span className="text-gray-700 font-semibold">
                                🃏 Flashcard (Lật thẻ)
                            </span>
                        }
                        name="flashcard"
                        rules={[
                            { type: 'number', min: 0, max: deckSize, message: `Số lượng từ 0 đến ${deckSize}` }
                        ]}
                    >
                        <InputNumber
                            min={0}
                            max={deckSize}
                            className="w-full"
                            placeholder="Số thẻ flashcard"
                        />
                    </Form.Item>

                    <Divider />

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleCancel}
                            className="flex-1 h-12"
                            size="large"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="flex-1 h-12 bg-blue-500 hover:bg-blue-600"
                            size="large"
                        >
                            {loading ? 'Đang tạo...' : 'Bắt đầu luyện tập'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default ReviewSessionModal;