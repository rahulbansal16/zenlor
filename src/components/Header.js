import { useSelector } from "react-redux"

const Header = () => {
    const name = useSelector( state => state.taskReducer.name)
    return (<h1 style={{marginBottom:'5px'}}>
        {name}
    </h1>)
}

export default Header