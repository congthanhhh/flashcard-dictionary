import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import { PlusOutlined, SoundOutlined, EditOutlined } from '@ant-design/icons';
import { addCardToDeck, updateCard } from '../../service/card';

const { TextArea } = Input;
const { Option } = Select;

const NewCardSimple = ({ open, onClose, onSuccess, deckId, editCard = null }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [examples, setExamples] = useState(['']);

    const isEditMode = !!editCard;

    // Predefined categories theo API doc
    const predefinedCategories = [
        'noun', 'verb', 'adjective', 'adverb', 'preposition',
        'work', 'education', 'technology', 'travel', 'food',
        'health', 'family', 'nature', 'sports', 'entertainment',
        'business', 'science', 'art', 'music', 'politics'
    ];

    // Load data when editing
    useEffect(() => {
        if (isEditMode && editCard) {
            form.setFieldsValue({
                name: editCard.name,
                definition: editCard.definition,
                word_type: editCard.word_type,
                hint: editCard.hint,
            });
            setCategories(editCard.category || []);
            setExamples(editCard.example?.length > 0 ? editCard.example : ['']);
        } else {
            // Reset form khi không edit
            form.resetFields();
            setCategories([]);
            setExamples(['']);
        }
    }, [editCard, isEditMode, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            // Chỉ gửi các field có trong API doc
            const cardData = {
                name: values.name,
                definition: values.definition,
                word_type: values.word_type || '',
                hint: values.hint || '',
                category: categories,
                example: examples.filter(ex => ex.trim() !== '')
            };

            let result;
            if (isEditMode) {
                result = await updateCard(editCard._id, cardData);
                message.success('Cập nhật thẻ thành công!');
            } else {
                result = await addCardToDeck(deckId, cardData);
                message.success('Thêm thẻ thành công!');
            }

            // Reset form
            form.resetFields();
            setCategories([]);
            setExamples(['']);

            onSuccess?.(result);
            onClose();
        } catch (error) {
            console.error('Error saving card:', error);
            message.error(error.message || (isEditMode ? 'Không thể cập nhật thẻ' : 'Không thể thêm thẻ'));
        } finally {
            setLoading(false);
        }
    };

    const handleAddExample = () => {
        setExamples([...examples, '']);
    };

    const handleExampleChange = (index, value) => {
        const newExamples = [...examples];
        newExamples[index] = value;
        setExamples(newExamples);
    };

    const handleRemoveExample = (index) => {
        if (examples.length > 1) {
            const newExamples = examples.filter((_, i) => i !== index);
            setExamples(newExamples);
        }
    };

    const handlePlaySound = (text) => {
        if ('speechSynthesis' in window && text) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        } else {
            message.info('Text-to-speech không khả dụng');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setCategories([]);
        setExamples(['']);
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    {isEditMode ? (
                        <EditOutlined className="text-blue-500" />
                    ) : (
                        <PlusOutlined className="text-green-500" />
                    )}
                    {isEditMode ? 'Chỉnh sửa Thẻ' : 'Thêm Thẻ Mới'}
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={700}
            className="top-4"
        >
            <div className="p-2 max-h-[70vh] overflow-y-auto">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {/* Word/Term */}
                            <Form.Item
                                label={
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-700">Từ / Thuật ngữ</span>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<SoundOutlined />}
                                            onClick={() => handlePlaySound(form.getFieldValue('name'))}
                                            className="text-blue-500 hover:bg-blue-50"
                                        />
                                    </div>
                                }
                                name="name"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập từ!' },
                                    { min: 1, message: 'Từ phải có ít nhất 1 ký tự!' },
                                    { max: 100, message: 'Từ không được quá 100 ký tự!' }
                                ]}
                            >
                                <Input
                                    placeholder="Ví dụ: Beautiful"
                                    className="rounded-lg border-gray-300 focus:border-blue-500"
                                    size="large"
                                />
                            </Form.Item>

                            {/* Definition */}
                            <Form.Item
                                label={<span className="text-sm font-semibold text-gray-700">Định nghĩa</span>}
                                name="definition"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập định nghĩa!' },
                                    { min: 3, message: 'Định nghĩa phải có ít nhất 3 ký tự!' },
                                    { max: 300, message: 'Định nghĩa không được quá 300 ký tự!' }
                                ]}
                            >
                                <TextArea
                                    placeholder="Ví dụ: Đẹp, xinh đẹp"
                                    rows={3}
                                    className="rounded-lg border-gray-300 focus:border-blue-500"
                                    showCount
                                    maxLength={300}
                                />
                            </Form.Item>

                            {/* Word Type */}
                            <Form.Item
                                label={<span className="text-sm font-semibold text-gray-700">Loại từ</span>}
                                name="word_type"
                            >
                                <Select
                                    placeholder="Chọn loại từ"
                                    className="rounded-lg"
                                    size="large"
                                    allowClear
                                >
                                    <Option value="noun">Noun (Danh từ)</Option>
                                    <Option value="verb">Verb (Động từ)</Option>
                                    <Option value="adjective">Adjective (Tính từ)</Option>
                                    <Option value="adverb">Adverb (Trạng từ)</Option>
                                    <Option value="preposition">Preposition (Giới từ)</Option>
                                    <Option value="pronoun">Pronoun (Đại từ)</Option>
                                    <Option value="conjunction">Conjunction (Liên từ)</Option>
                                    <Option value="interjection">Interjection (Thán từ)</Option>
                                </Select>
                            </Form.Item>

                            {/* Hint */}
                            <Form.Item
                                label={<span className="text-sm font-semibold text-gray-700">Gợi ý</span>}
                                name="hint"
                            >
                                <Input
                                    placeholder="Ví dụ: attractive, pleasing to look at"
                                    className="rounded-lg border-gray-300 focus:border-blue-500"
                                    size="large"
                                />
                            </Form.Item>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {/* Categories */}
                            <Form.Item
                                label={<span className="text-sm font-semibold text-gray-700">Danh mục</span>}
                            >
                                <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    placeholder="Chọn hoặc nhập danh mục"
                                    value={categories}
                                    onChange={setCategories}
                                    className="rounded-lg"
                                    size="large"
                                >
                                    {predefinedCategories.map(cat => (
                                        <Option key={cat} value={cat}>{cat}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Examples Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-gray-700">Ví dụ</span>
                                    <Button
                                        type="dashed"
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={handleAddExample}
                                        className="text-blue-500 border-blue-300 hover:border-blue-500"
                                    >
                                        Thêm ví dụ
                                    </Button>
                                </div>
                                {examples.map((example, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <Input
                                            placeholder={`Ví dụ ${index + 1}: "She has a beautiful smile."`}
                                            value={example}
                                            onChange={(e) => handleExampleChange(index, e.target.value)}
                                            className="flex-1 rounded-lg border-gray-300 focus:border-blue-500"
                                        />
                                        {examples.length > 1 && (
                                            <Button
                                                type="text"
                                                danger
                                                onClick={() => handleRemoveExample(index)}
                                                className="px-2"
                                            >
                                                ✕
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            onClick={handleCancel}
                            className="flex-1 h-12 text-gray-600 border-gray-300 hover:border-gray-400"
                            size="large"
                        >
                            Huỷ
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className={`flex-1 h-12 ${isEditMode ? 'bg-blue-500 hover:bg-blue-600 border-blue-500' : 'bg-green-500 hover:bg-green-600 border-green-500'}`}
                            size="large"
                        >
                            {loading ? (isEditMode ? 'Đang cập nhật...' : 'Đang thêm...') : (isEditMode ? 'Cập nhật' : 'Thêm thẻ')}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default NewCardSimple;
