import { useEffect } from "react"
import { auth } from "../firebase"
import { useHistory } from 'react-router-dom';

const RedirectToLogin = () => {

    const history = useHistory();
    useEffect ( () => {
        console.log('The auth is', auth)
        if (!auth || !auth.currentUser || !auth.currentUser.uid){
            history.push('/login')
        }
    }, [])
    return(<div></div>)
}
export default RedirectToLogin