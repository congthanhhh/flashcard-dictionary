import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Alert, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { loginUser } from '../../service/user';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        if (isOpen) {
            setError('');
            form.resetFields();
        }
    }, [isOpen, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        setError('');

        try {
            const response = await loginUser({
                email: values.email,
                password: values.password
            });

            console.log('Login successful:', response);

            messageApi.open({
                content: <div className="text-lg text-green-600">Đăng nhập thành công</div>,
                duration: 2,
                type: "success"
            });

            form.resetFields();

            if (onLoginSuccess) {
                onLoginSuccess();
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setError('');
        onClose();
    };

    return (
        <Modal
            title={
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
                    <p className="text-gray-600 text-sm">Chào mừng bạn trở lại!</p>
                </div>
            }
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            width={450}
            className="login-modal"
        >
            {contextHolder}
            <div className="mt-6">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-4"
                >
                    {error && (
                        <Alert
                            message="Đăng nhập thất bại"
                            description={error}
                            type="error"
                            showIcon
                            closable
                            onClose={() => setError('')}
                            className="mb-4"
                        />
                    )}

                    <Form.Item
                        name="email"
                        label={<span className="text-gray-700 font-medium">Email</span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                            placeholder="Nhập địa chỉ email"
                            className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:shadow-lg transition-all duration-200"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<span className="text-gray-700 font-medium">Mật khẩu</span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Nhập mật khẩu"
                            className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:shadow-lg transition-all duration-200"
                        />
                    </Form.Item>

                    <div className="pt-4">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-11 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-lg text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </div>

                    <div className="text-center pt-2">
                        <span className="text-gray-600 text-sm">
                            Chưa có tài khoản?
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="text-blue-500 hover:text-blue-600 ml-1 font-medium cursor-pointer bg-transparent border-none"
                            >
                                Đăng ký ngay
                            </button>
                        </span>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default LoginModal;
