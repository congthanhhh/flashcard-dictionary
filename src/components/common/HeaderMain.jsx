import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Typography, Button, Dropdown, Space, message } from "antd";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import { logout } from "../../service/user";
const { Title } = Typography;

const HeaderMain = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);


  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   if (token) {
  //     setIsLoggedIn(true);
  //     const userData = 
  //   }
  // },[])

  const handleLogout = () => {
    const logoutSuccess = logout();
    if (logoutSuccess) {
      messageApi.open({
        content: <div className="text-lg text-green-600">Đăng xuất thành công</div>,
        duration: 2,
        type: "success"
      });
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <span onClick={handleLoginClick} className="cursor-pointer">
          Đăng nhập
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="">
          Trang cá nhân
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <span onClick={handleLogout} className="cursor-pointer">
          Đăng xuất
        </span>
      ),
    },
  ];
  return (
    <div className="max-w-screen-xl mx-auto flex items-center justify-between">
      {contextHolder}
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
            <span className="text-white text-lg font-bold">EF</span>
          </div>
          <Title level={4} className="!mb-0 !text-gray-800">
            English Flashcard
          </Title>
        </div>

        <div className="flex space-x-6 items-center">
          <span className="text-gray-600 hover:text-blue-500 cursor-pointer">
            Trang chủ
          </span>
          <span className="text-gray-600 hover:text-blue-500 cursor-pointer">
            Đang học
          </span>
          <span className="text-gray-600 hover:text-blue-500 cursor-pointer">
            List từ của tôi
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 cursor-pointer">
        <Space direction="vertical">
          <Space wrap>
            <Dropdown menu={{ items }} placement="bottomLeft">
              <Button className="w-8 h-8 rounded-xl">
                <UserOutlined />
              </Button>
            </Dropdown>
          </Space>
        </Space>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default HeaderMain;
