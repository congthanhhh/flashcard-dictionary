import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { createUserDeck } from '../../service/deck';

const { TextArea } = Input;

const NewDeck = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const deckData = {
                name: values.name,
                description: values.description
            };

            const newDeck = await createUserDeck(deckData);
            message.success('Tạo deck thành công!');
            form.resetFields();
            onSuccess?.(newDeck);
            onClose();
        } catch (error) {
            console.error('Error creating deck:', error);
            message.error(error.message || 'Không thể tạo deck');
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
                <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    Tạo Deck Mới
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            className="top-8"
        >
            <div className="p-2">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-4"
                >
                    {/* Deck Name */}
                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Tên Deck</span>}
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên deck!' },
                            { min: 3, message: 'Tên deck phải có ít nhất 3 ký tự!' },
                            { max: 100, message: 'Tên deck không được quá 100 ký tự!' }
                        ]}
                    >
                        <Input
                            placeholder="Ví dụ: Từ vựng tiếng Anh cơ bản"
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            size="large"
                        />
                    </Form.Item>

                    {/* Description */}
                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Mô tả</span>}
                        name="description"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mô tả!' },
                            { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
                            { max: 500, message: 'Mô tả không được quá 500 ký tự!' }
                        ]}
                    >
                        <TextArea
                            placeholder="Mô tả chi tiết về nội dung và mục đích của deck..."
                            rows={4}
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            onClick={handleCancel}
                            className="flex-1 h-12 text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-700"
                            size="large"
                        >
                            Huỷ
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                            size="large"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo Deck'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default NewDeck;
