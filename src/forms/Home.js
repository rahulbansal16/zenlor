import { Empty } from "antd"
import { useSelector } from "react-redux"
import PlusButton from "../components/PlusButton"
import UpdateCard from "./UpdateCard"

const Home = ({department}) => {

    console.log("The department is", department)
    const updates = useSelector( state => state.taskReducer[department] || [])
    console.log("The updates are", updates)

    return (
        <div>
            {department.toUpperCase()}
            {updates.map( ({styleCode, styleCodeId})  => <UpdateCard styleCode={styleCode} styleCodeId = {styleCodeId}/>)}
            {updates.length === 0 && <Empty/>}
            <PlusButton url = {`/${department}/process/form`}/>
        </div>
    )
}

export default Home