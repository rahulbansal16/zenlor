import { Spin, Space } from 'antd';
const Loader = () => {
    return (
        <div className = "storySize" style ={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height:'100vh'
        }}>
            <Space size="middle">
                <Spin size="large" />
                <Spin />
            <Spin size="large" />
            </Space>
        </div>
    )
}

export default Loader