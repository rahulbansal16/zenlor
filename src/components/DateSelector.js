import { Select } from "antd";
import moment from "moment";
const { Option } = Select;

const DateSelector = ({ onChange }) => {
  return (
    <Select
      defaultValue={moment().add(0, "days").format("MMM DD")}
      style={{ width: 120 }}
      onChange={(v) => {
        console.log("The value is", v)
        onChange(v);
      }}
    >
      {[0, 1, 2, 3].map((day) => (
        <Option value={day}>
          {moment().subtract(day, "days").format("MMM DD")}
        </Option>
      ))}
    </Select>
  );
};
export default DateSelector;
