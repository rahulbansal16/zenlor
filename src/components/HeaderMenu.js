import {Menu} from "antd"
import { Header } from "antd/lib/layout/layout";

const HeaderMenu = () => {
    return (
        <Header>
      <Menu mode="horizontal" defaultSelectedKeys={['2']}>
        {new Array(6).fill(null).map((_, index) => {
          const key = index + 1;
          return <Menu.Item key={key}>{`nav ${key}`}</Menu.Item>;
        })}
      </Menu>
    </Header>
    )
}

export default HeaderMenu;
