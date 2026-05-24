import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            if (!res?.message) {
                setDataSource(res)
            } else {
                notification.error({
                    message: "Không được phép",
                    description: res.message
                })
            }
        }

        fetchUser();
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
        }
    ];

    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource} columns={columns}
                rowKey={"_id"}
            />
        </div>
    )
}

export default UserPage;
