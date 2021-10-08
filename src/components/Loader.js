import { Spin, Space } from 'antd';
const Loader = () => {
    return (
        <div className = "storySize" style ={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Space size="middle">
                <Spin size="small" />
                <Spin />
            <Spin size="large" />
            </Space>
        </div>
    )
}

export default Loader