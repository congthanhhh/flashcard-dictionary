import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { createUserDeck, updateUserDeck } from '../../service/deck';
import { uploadImage } from '../../service/card';

const { TextArea } = Input;

const NewDeck = ({ open, onClose, onSuccess, editDeck = null }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const isEditMode = !!editDeck;

    useEffect(() => {
        if (isEditMode && editDeck && open) {
            form.setFieldsValue({
                name: editDeck.name,
                description: editDeck.description
            });
            setImageUrl(editDeck.url || '');
        } else if (!isEditMode && open) {
            form.resetFields();
            setImageUrl('');
        }
    }, [editDeck, isEditMode, open, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const deckData = {
                name: values.name,
                description: values.description,
                url: imageUrl || ''
            };

            if (isEditMode) {
                await updateUserDeck(editDeck._id, deckData);
                message.success('Cập nhật deck thành công!');
            } else {
                await createUserDeck(deckData);
                message.success('Tạo deck thành công!');
            }

            form.resetFields();
            setImageUrl('');
            onSuccess?.();
            onClose();
        } catch (error) {
            message.error(error.message || 'Không thể lưu deck');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file) => {
        try {
            setImageUploading(true);
            const result = await uploadImage(file);
            setImageUrl(result.filePath);
            message.success('Upload ảnh thành công!');
        } catch (error) {
            message.error('Upload ảnh thất bại!');
        } finally {
            setImageUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl('');
    };

    const handleCancel = () => {
        form.resetFields();
        setImageUrl('');
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    {isEditMode ? 'Chỉnh sửa Deck' : 'Tạo Deck Mới'}
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

                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Hình ảnh Deck</span>}
                    >
                        <div className="space-y-3">
                            {imageUrl && (
                                <div className="relative inline-block">
                                    <img
                                        src={imageUrl}
                                        alt="Deck preview"
                                        className="w-full h-40 object-cover rounded-lg border border-gray-300"
                                    />
                                    <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 rounded-full"
                                        size="small"
                                        title="Xóa ảnh"
                                    />
                                </div>
                            )}

                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    if (file.size > 5 * 1024 * 1024) {
                                        message.error('Kích thước file không được vượt quá 5MB!');
                                        return false;
                                    }

                                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                                    if (!validTypes.includes(file.type)) {
                                        message.error('Chỉ hỗ trợ file JPG, PNG, GIF!');
                                        return false;
                                    }

                                    handleImageUpload(file);
                                    return false;
                                }}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    loading={imageUploading}
                                    className="w-full h-12 border-dashed border-gray-300 hover:border-blue-400"
                                    size="large"
                                >
                                    {imageUploading ? 'Đang upload...' : (imageUrl ? 'Thay đổi ảnh' : 'Chọn ảnh cho deck')}
                                </Button>
                            </Upload>

                            <p className="text-xs text-gray-500 text-center">
                                Hỗ trợ JPG, PNG, GIF. Tối đa 5MB.
                            </p>
                        </div>
                    </Form.Item>

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
                            {loading ? (isEditMode ? 'Đang cập nhật...' : 'Đang tạo...') : (isEditMode ? 'Cập nhật Deck' : 'Tạo Deck')}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default NewDeck;
