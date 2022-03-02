import { Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  UpSquareOutlined,
  ContainerOutlined,
  MailOutlined,
  ToolOutlined,
  DollarOutlined,
  AccountBookOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Layout } from 'antd';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;

const SideBar = ({type}) => {

    const [collapsed, setCollapsed] = useState(false);
    const history = useHistory()
    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    };
    const clickHandler = (e) => {
        console.log("The click is ",e)
        history.push({
            pathname:`/action/${e.key}`
        })
    }
    return(
        <Sider 
        style={{
            height:'100vh'
        }}
        >
            <Button type="primary" onClick={toggleCollapsed}>
                {/* {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>} */}
            </Button>
        <Menu
          defaultSelectedKeys={['dashboard']}
          defaultOpenKeys={['style','procure','inventory']}
          selectedKeys={type}
          mode="inline"
          theme="dark"
          onClick={(e)=>clickHandler(e)}
          inlineCollapsed={true}
        >
          <SubMenu key="style" icon={<DesktopOutlined />} title="STYLE">
            <Menu.Item key="dashboard">Style Dashboard</Menu.Item>
            <Menu.Item key="orderMaterials">Bill Of Materials</Menu.Item>
          </SubMenu>
          <SubMenu key="crm" icon={<ContainerOutlined />} title="CRM">
          {/* Sale Orders	Costing & Pricing */}
            <Menu.Item key="saleOrders">Sale Orders</Menu.Item>
            <Menu.Item key="costingAndPricing">Costing And Pricing</Menu.Item>
          </SubMenu>
          <SubMenu key="procure" icon={<UpSquareOutlined />} title="PROCURE">
          {/* Purchase Orders	Transfer Orders	Quotations */}
            <Menu.Item key="purchaseOrder">Purchase Orders</Menu.Item>
            <Menu.Item key="transferOrderQuotations">Transder Orders Quotations</Menu.Item>
          </SubMenu>
          {/* <Menu.Item key="1" icon={<PieChartOutlined />}>
            Style
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            CRM
          </Menu.Item>
          <Menu.Item key="3" icon={<ContainerOutlined />}>
            PROCURE
          </Menu.Item> */}
          <SubMenu key="inventory" icon={<AccountBookOutlined />} title="INVENTORY">
          {/* Style Dashboard	Bill of Materials */}
          {/* Item List	Goods Received Notes	Goods Consumed Notes	Goods Dispatched Notes */}
            <Menu.Item key="itemList">Item List</Menu.Item>
            <Menu.Item key="inwardMaterial">Goods Received Notes</Menu.Item>
            <Menu.Item onClick={() => window.open('https://zenlor.web.app/store?lineNumber=1')} key="goodsConsumedNotes">Goods Consumed Notes</Menu.Item>
            <Menu.Item key="goodsDispatchedNotes">Goods Dispatched Notes</Menu.Item>
          </SubMenu>
          <SubMenu key="jobwork" icon={<MailOutlined />} title="JOB WORK">
          {/* Received Orders	Issued Orders */}
            <Menu.Item key="receivedOrders">Received Orders</Menu.Item>
            <Menu.Item key="issuedOrders">Issued Orders</Menu.Item>
          </SubMenu>
          <SubMenu key="payments" icon={<DollarOutlined />} title="PAYMENTS">
            {/* <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item> */}
          </SubMenu>
          <SubMenu key="analytics" icon={<PieChartOutlined />} title="ANALYTICS">
            {/* <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item> */}
          </SubMenu>
          <SubMenu key="tools" icon={<ToolOutlined />} title="TOOLS">
            {/* <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item> */}
          </SubMenu>
        </Menu>
        </Sider>
    )
}

export default SideBar;