import React from 'react'
import { Card, Button } from 'antd'
import { SoundOutlined, SwapOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import PaginationFC from './PaginationFC';

const CardDetail = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-screen-xl mx-auto p-6">
            <div className="max-w-4xl mx-auto">
                <div className='text-2xl font-bold p-2 uppercase'>
                    Flashcards: từ vựng tiếng Anh giao tiếp cơ bản
                </div>
                <br />
                <div className='w-full'>
                    <Button onClick={() => navigate('/flashcard')}
                        color='primary' variant='filled' size='large' className='w-full font-semibold'>Luyện tập flashcards</Button>
                </div>
                <br />
                <div className='text-lg font-medium p-2 text-blue-500'>
                    <SwapOutlined />
                    <a className='ml-1' href="">Xem ngẫu nhiên</a>
                </div>
                <p className='text-lg font-medium mb-2 p-2'>List có 500 từ</p>
                <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex-1">
                            <div className="mb-3">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-3xl font-bold text-gray-800">absent</h1>
                                    <span className="text-gray-600 text-lg">(adjective)</span>
                                    <span className="text-blue-600 text-lg font-mono">/ ˈæbsənt/</span>
                                    <Button
                                        type="text"
                                        icon={<SoundOutlined />}
                                        className="text-blue-500 hover:bg-blue-50"
                                        size="small"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">Định nghĩa:</h3>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    vắng mặt (vì đau ốm,...)
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ví dụ:</h3>
                                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                                    <p className="text-gray-800 mb-1 italic">
                                        "Most students were absent from school at least once"
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        (Hầu hết sinh viên đã vắng mặt ít nhất một lần)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="lg:w-80 w-full">
                            <div className="h-40 lg:h-40">
                                <img
                                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
                                    alt="Empty classroom desks"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <br />
                <PaginationFC />
            </div>
        </div>
    )
}

export default CardDetail