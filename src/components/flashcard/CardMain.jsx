import { FileTextOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom';
import PaginationFC from './PaginationFC';

const CardMain = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-screen-xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Card onClick={() => navigate('/card-detail')}
                    className="shadow-lg bg-slate-100
                cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                    cover={
                        <div className="h-32 overflow-hidden">
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    }
                >
                    <div className="">
                        <h3 className="text-base font-semibold text-gray-800 line-clamp-3 mb-2 leading-tight">
                            Từ vựng tiếng Anh giao tiếp cơ bản
                        </h3>
                        <div className="text-gray-500 font-medium flex">
                            <div>
                                <FileTextOutlined />
                                200 từ
                            </div>
                            <div className='mx-2'>|</div>
                            <div>
                                <UsergroupAddOutlined />
                                16203
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <PaginationFC />
        </div>
    )
}

export default CardMain