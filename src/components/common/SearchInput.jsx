import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'

const SearchInput = () => {
    return (
        <div className="bg-purple-100 px-6 py-9">
            <div className="max-w-screen-xl mx-auto flex justify-center">
                <Input
                    placeholder="Tìm kiếm từ vựng hoặc chủ đề..."
                    suffix={<SearchOutlined />}
                    size="large"
                    className="max-w-md w-full"
                    style={{ borderRadius: '8px' }}
                />
            </div>
        </div>
    )
}

export default SearchInput