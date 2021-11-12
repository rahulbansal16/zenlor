import { useEffect, useState } from "react"
import PlusButton from "../components/PlusButton"
import UpdateCard from "./UpdateCard"

const Home = ({department = "cutting"}) => {

    const [updates, setUpdates] = useState([1,2])

    useEffect( () => {
    }, [department])

    const fetchUpdates = (department) => {
        return
    }

    return (
        <div>
            {department.toUpperCase()}
            {updates.map( update  => <UpdateCard styleCodeName={"WNGN12"}/>)}
            <PlusButton url = {`/${department}/process/form`}/>
        </div>
    )
}

export default Home