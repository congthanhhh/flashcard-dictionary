import { Pagination } from "antd";

const PaginationFC = () => {
    return (
        <Pagination
            align="end"
            simple
            showSizeChanger={false}
            total={50}
        />
    )
}

export default PaginationFC