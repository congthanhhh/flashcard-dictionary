import { Pagination } from "antd";

const PaginationFC = ({ current, total, pageSize, onChange }) => {
    return (
        <Pagination
            align="end"
            simple
            showSizeChanger={false}
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={onChange}
        />
    )
}

export default PaginationFC