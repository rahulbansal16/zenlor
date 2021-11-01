import { Menu } from 'antd';
import { useState } from 'react';
import Tasks from './Tasks';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const TaskHome = ({inCompleteTasks, completeTasks}) => {
    const tabChangeHnadler = (key) => {
        console.log('The key is', key)
    }
    return (
        <Tabs defaultActiveKey = "incomplete" centered onChange={tabChangeHnadler}>
            <TabPane tab = "Incomplete Tasks" key="incomplete">
                <Tasks tasks={inCompleteTasks}/>
            </TabPane>
            <TabPane tab = "Completed Tasks" key="complete">
                <Tasks tasks={completeTasks}/>
            </TabPane>
        </Tabs>
    )

}

export default TaskHome