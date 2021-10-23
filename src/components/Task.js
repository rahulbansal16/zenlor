import {
  Form,
  Input,
  Radio,
  Space,
  Button,
  Image,
  Typography,
  Timeline,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import CONSTANTS from "../CONSTANTS";
import { updateTaskStatus, fetchTask, fetchTaskRemarks } from "../firebase";
const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 20,
      // offset:2
    },
    sm: {
      span: 20,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
      // offset:2
    },
    sm: {
      span: 20,
      // offset:2
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      // offset: 2,
    },
    sm: {
      span: 24,
      // offset: 2,
    },
  },
};

const Task = ({ styleCodeId, taskId }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [task, setTask] = useState({});

  const onFinish = async (values) => {
    console.log(values);
    await updateTaskStatus(styleCodeId, taskId, values);
    history.push("/tasks");
  };

  useEffect(() => {
    const getData = async () => {
      const task = await fetchTask(styleCodeId, taskId);
      setTask(task.data());
    };
    getData();
  }, [styleCodeId, taskId]);

  return (
    <div>
      <TaskHeader taskName={task.name || "Task Name"} />
      <Form
        {...formItemLayout}
        layout="vertical"
        form={form}
        style={{
          marginLeft: "8px",
          marginRight: "8px",
        }}
        size="large"
        name="styleCodeEditor"
        align="left"
        onFinish={onFinish}
        initialValues={{
          status: "incomplete",
          // residence: ['zhejiang', 'hangzhou', 'xihu'],
          // prefix: '86',
        }}
        scrollToFirstError
      >
        <Form.Item
          label="1. Task Status"
          name="status"
          rules={[
            {
              required: true,
              message: "Please update the Task Status",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="incomplete">Incomplete</Radio>
            <Radio value="complete">Complete</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          autocomplete="false"
          label="2. Progress Update"
          name="progressUpdate"
          rules={[
            {
              required: true,
              message: "Please add the remarks",
            },
          ]}
        >
          <Input autoComplete="off" autocomplete="off"/>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button danger onClick={() => history.goBack()}>
              Back
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <RemarksTimeline
        companyId={CONSTANTS.companyId}
        styleCodeId={styleCodeId}
        taskId={taskId}
      />
    </div>
  );
};

export default Task;

const TaskHeader = ({ taskName }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* <Image width="20%" height="20%" src={"https://firebasestorage.googleapis.com/v0/b/zenlor.appspot.com/o/stylecodes%2Fanusha_8923%2FqAHJ6vkeZ1kS.png?alt=media&token=ddf65e53-3125-4385-9e0a-ee50dc7f5a3b"}></Image> */}
      <Title style={{ width: "100%" }} level={5}>
        {taskName}
      </Title>
    </div>
  );
};

const RemarksTimeline = ({ companyId, styleCodeId, taskId }) => {
  const [pastRemarks, setPastRemarks] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const remarks = await fetchTaskRemarks(companyId, styleCodeId, taskId);
      setPastRemarks(remarks);
    };
    getData();
  }, [companyId, styleCodeId, taskId]);
  return (
    <div className="mx-8 txt-al-left">
      <Title level={5} className="margin-bottom-20 txt-al-left">
        Past Remarks
      </Title>
      <Timeline mode="center">
        {pastRemarks.map((pastRemark) => (
          <Timeline.Item key={pastRemark.id}>
            { "On " + moment(pastRemark.createdAt).format("DD-MMM,hh:mm a") + " :- "+ pastRemark.progressUpdate}
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};
