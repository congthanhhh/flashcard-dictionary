import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, Space } from "antd";
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const MyList = () => {
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");

  const showModal1 = () => setIsModalOpen1(true);
  const showModal2 = () => setIsModalOpen2(true);
  const handleOk1 = () => setIsModalOpen1(false);
  const handleOk2 = () => setIsModalOpen2(false);
  const handleCancel1 = () => setIsModalOpen1(false);
  const handleCancel2 = () => setIsModalOpen2(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <span className="text-3xl font-semibold mr-2">Flash Card:</span>
        <span className="text-3xl font-semibold mr-2">{title1}</span>
        <div>
          <Button className="font-semibold mr-2" type="primary" onClick={showModal1}>
            Chỉnh sửa
          </Button>
          <Button className="font-semibold" type="primary" onClick={showModal2}>
            Thêm từ mới
          </Button>
          <Modal
            title={<span style={{ fontSize: 30, fontWeight: 650 }}>Chỉnh sửa list từ</span>}
            open={isModalOpen1}
            onOk={handleOk1}
            onCancel={handleCancel1}
            okText="Lưu"
            cancelText="Hủy"
            cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white', borderColor: 'red' } }}
          >
            <p className="text-base mb-1">Tiêu đề</p>
            <Form>
              <Form.Item name="">
                <Input
                  className="w-[470px] h-[40px]"
                  value={title1}
                  onChange={e => setTitle1(e.target.value)}
                />
              </Form.Item>
            </Form>
            <p className="text-base mb-1">Ngôn ngữ</p>
            <Space wrap>
              <Select
                defaultValue="Tiếng Anh-Mỹ"
                style={{ width: 470, height: 40}}
                onChange={handleChange}
                options={[
                  { value: "Tiếng Anh-Mỹ", label: "Tiếng Anh-Mỹ" },
                  { value: "Tiếng Anh-Anh", label: "Tiếng Anh-Anh" },
                ]}
              />
            </Space>
            <p className="mt-8 text-base mb-1">Mô tả</p>
            <Form>
              <Form.Item name="">
                <Input className="w-[470px] h-16" />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title={<span style={{ fontSize: 30, fontWeight: 650 }}>Tạo flashcard</span>}
            open={isModalOpen2}
            onOk={handleOk2}
            onCancel={handleCancel2}
            okText="Lưu"
            cancelText="Hủy"
            cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white', borderColor: 'red' } }}
          >
            <p>List từ: {title1}</p>
            <p className="text-base mb-1">Từ mới</p>
            <Form>
              <Form.Item name="">
                <Input
                  className="w-[470px] h-[40px]"
                  value={title2}
                  onChange={e => setTitle2(e.target.value)}
                />
              </Form.Item>
            </Form>
            <p className="mt-8 text-base mb-1">Định Nghĩa</p>
            <Form>
              <Form.Item name="">
                <Input className="w-[470px] h-16" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
};
export default MyList;
