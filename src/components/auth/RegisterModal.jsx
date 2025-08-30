import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { registerUser } from '../../service/user';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values) => {
        setLoading(true);
        setError('');
        try {
            const response = await registerUser({
                username: values.username,
                name: values.name,
                email: values.email,
                password: values.password,
            });
            console.log(response);
            messageApi.open({
                content: <div className="text-lg text-green-600">Đăng ký thành công</div>,
                duration: 2,
                type: "success"
            });
            form.resetFields();
            onClose();
        } catch (error) {
            message.error('Đăng ký thất bại. Vui lòng thử lại!');
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
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký</h2>
                    <p className="text-gray-600 text-sm">Tạo tài khoản mới để bắt đầu học!</p>
                </div>
            }
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            centered
            width={450}
            className="register-modal"
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
                            message="Đăng ký thất bại"
                            description={error}
                            type="error"
                            showIcon
                            closable
                            onClose={() => setError('')}
                            className="mb-4"
                        />
                    )}
                    <Form.Item
                        name="username"
                        label={<span className="text-gray-700 font-medium">Tên đăng nhập</span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                            { min: 3, message: 'Tên đăng nhập phải có ít nhất 2 ký tự!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Nhập tên đăng nhập"
                            className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:shadow-lg transition-all duration-200"
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label={<span className="text-gray-700 font-medium">Họ và tên</span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên!' }
                        ]}
                    >
                        <Input
                            prefix={<IdcardOutlined className="text-gray-400" />}
                            placeholder="Nhập họ và tên"
                            className="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:shadow-lg transition-all duration-200"
                        />
                    </Form.Item>

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

                    <Form.Item
                        name="confirmPassword"
                        label={<span className="text-gray-700 font-medium">Xác nhận mật khẩu</span>}
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Nhập lại mật khẩu"
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
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </Button>
                    </div>

                    <div className="text-center pt-2">
                        <span className="text-gray-600 text-sm">
                            Đã có tài khoản?
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-blue-500 hover:text-blue-600 ml-1 font-medium cursor-pointer bg-transparent border-none"
                            >
                                Đăng nhập ngay
                            </button>
                        </span>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default RegisterModal;
