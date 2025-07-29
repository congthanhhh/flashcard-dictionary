import { UserOutlined } from '@ant-design/icons'
import { Typography } from 'antd'

const { Title } = Typography

const HeaderMain = () => {
    return (
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">EF</span>
                    </div>
                    <Title level={4} className="!mb-0 !text-gray-800">English Flashcard</Title>
                </div>

                <div className="flex space-x-6 items-center">
                    <span className="text-gray-600 hover:text-blue-500 cursor-pointer">Trang chủ</span>
                    <span className="text-gray-600 hover:text-blue-500 cursor-pointer">Đang học</span>
                    <span className="text-gray-600 hover:text-blue-500 cursor-pointer">List từ của tôi</span>
                </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer">
                <span>John Wick</span>
                <UserOutlined />
            </div>
        </div>
    )
}

export default HeaderMain