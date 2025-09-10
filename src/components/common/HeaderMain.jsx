import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Typography, Button, Dropdown, Space, message } from "antd";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import { getUserProfile, logout } from "../../service/user";
const { Title } = Typography;

const HeaderMain = () => {
  const navigate = useNavigate();
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

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    const userProfile = await getUserProfile();
    setUserData(userProfile);
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

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsLoggedIn(true);
        const userProfile = await getUserProfile();
        setUserData(userProfile);
      }
    }
    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    const logoutSuccess = logout();
    if (logoutSuccess) {
      setIsLoggedIn(false);
      setUserData(null);
      messageApi.open({
        content: <div className="text-lg text-green-600">Đăng xuất thành công</div>,
        duration: 2,
        type: "success"
      });
    }
  };

  const handleMyListClick = () => {
    if (!isLoggedIn) {
      messageApi.warning({
        content: 'Vui lòng đăng nhập để sử dụng tính năng này',
        duration: 3,
      });
      setTimeout(() => {
        setIsLoginModalOpen(true);
      }, 1000);
    } else {
      navigate('/my-list');
    }
  };

  const items = isLoggedIn ? [
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
  ] : [
    {
      key: "1",
      label: (
        <span onClick={handleLoginClick} className="cursor-pointer">
          Đăng nhập
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span onClick={() => setIsRegisterModalOpen(true)} className="cursor-pointer">
          Đăng ký
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
          <span
            className="text-gray-600 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Trang chủ
          </span>
          <span
            className="text-gray-600 hover:text-blue-500 cursor-pointer"
            onClick={handleMyListClick}
          >
            List từ của tôi
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
          {isLoggedIn && userData ? (
            <div className="flex items-center space-x-2 px-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <span className="text-gray-700 font-medium">{userData.name}</span>
              <CaretDownOutlined className="text-gray-500 text-xs" />
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200">
              <div>
                <UserOutlined className="text-blue-500 text-base" />
                &nbsp; &nbsp;
                <CaretDownOutlined className="text-blue-500 text-base" />
              </div>
            </div>
          )}
        </Dropdown>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
        onLoginSuccess={handleLoginSuccess}
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
