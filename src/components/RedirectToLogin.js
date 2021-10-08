import { useEffect } from "react"
import { auth } from "../firebase"
import { useHistory } from 'react-router-dom';

const RedirectToLogin = () => {

    const history = useHistory();
    useEffect ( () => {
        if (auth && auth.currentUser && auth.currentUser.uid){
            history.push('/login')
        }
    })
    return(<div></div>)
}
export default RedirectToLogin