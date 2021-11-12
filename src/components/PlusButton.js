import postImage from "../assets/post48.png"
import { Link, useHistory } from 'react-router-dom';

const PlusButton = ({url}) => {
    const history = useHistory()
    return (
        <div>
        <img
      //   className="zoom"
        alt="Create new Style Code"
        style={{ backgroundColor: "green",
        position:'fixed',
        borderRadius:'24px',
        bottom: '40px',
        right:'20px'

        }}
       onClick={
                () => {
                history.push(url)
            }
        }
        src={postImage}
        />
    </div>
);
}
export default PlusButton;