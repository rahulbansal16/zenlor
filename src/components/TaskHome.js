import { Menu } from 'antd';
import { useState } from 'react';
import Tasks from './Tasks';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const TaskHome = () => {
    const [selected, setSelected] = useState("incomplete")
    const tabChangeHnadler = (key) => {
        console.log('The key is', key)
    }
    return (
        <Tabs defaultActiveKey = "incomplete" centered onChange={tabChangeHnadler}>
            <TabPane tab = "Incomplete Tasks" key="incomplete">
                <Tasks status={"incomplete"} shouldRemoveDependentTask={true}/>
            </TabPane>
            <TabPane tab = "Completed Tasks" key="complete">
                <Tasks status={"complete"}/>
            </TabPane>
        </Tabs>
    )

}

export default TaskHome