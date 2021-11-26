import { useEffect } from "react"
import Loader from "../components/Loader"
import { auth } from "../firebase"

const Logout = () => {
    useEffect( () => {
        auth.signOut()
    }, [])

    return <Loader/>
}

export default Logout