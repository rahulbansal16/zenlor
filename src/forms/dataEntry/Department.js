import { useSelector } from "react-redux"
import { useHistory } from "react-router"

const { Button, Space } = require("antd")

const Department = () => {
    const user = useSelector(state => state.taskReducer.user)

    const history = useHistory()

    const onClick = (path) => {
        history.push(path)
    }

    if (!user)
        return <div>
            <div>Please Login To continue</div>
            <Button 
            type="primary"
            size="large"
            onClick = { () => history.push("/login")}>Login</Button>
        </div>


    return (
        <div className="mg-x-8">
            <Button size="large" className="wd-100 mg-y" type="primary" onClick = { () => onClick("/cutting")}>Cutting</Button>
            <Button size="large" className="wd-100 mg-y" type="primary" onClick = { () => onClick("/sewing?lineNumber=1")}>Sewing Line 1</Button>
            <Button size="large" className="wd-100 mg-y" type="primary"onClick = { () => onClick("/sewing?lineNumber=2")}>Sewing Line 2</Button>
            <Button size="large" className="wd-100 mg-y" type="primary"onClick = { () => onClick("/sewing?lineNumber=3")}>Sewing Line 3</Button>
            <Button size="large" className="wd-100 mg-y" type="primary"onClick = { () => onClick("/kajjaandbuttoning")}>Kaja And Button</Button>
            <Button size="large" className="wd-100 mg-y" type="primary" onClick = { () => onClick("/washing")}>Washing</Button>
            <Button size="large" className="wd-100 mg-y" type="primary"onClick = { () => onClick("/packing")}>Packing</Button>
        </div>
    )
}

export default Department;