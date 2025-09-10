import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SearchInput = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="bg-purple-100 px-6 py-9">
            <div className="max-w-screen-xl mx-auto flex justify-center">
                <Input
                    placeholder="Tìm kiếm từ vựng hoặc chủ đề..."
                    suffix={<SearchOutlined onClick={handleSearch} />}
                    size="large"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onPressEnter={handleSearch}
                    className="max-w-md w-full"
                    style={{ borderRadius: '8px' }}
                />
            </div>
        </div>
    )
}

export default SearchInput