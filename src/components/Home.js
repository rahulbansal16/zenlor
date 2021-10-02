import { useEffect, useState } from "react";
import CONSTANTS from "../CONSTANTS";
import { fetchStyleCode } from "../firebase";

const PostIcon = () => {
  return (
    <img
      //   className="zoom"
      alt="Create new Style Code"
      style={{ backgroundColor: "none", borderRadius: "24px" }}
      //   onClick={this.logEvent}
      src={require("../assets/post48.png").require}
    />
  );
};

const styleCodeCard = () => {
  return <div></div>;
};

const Home = () => {
  const [styleCodes, setStyleCodes] = useState(["r", "b"]);

  useEffect(() => {
    fetchStyleCode(CONSTANTS.company_id).then((responseStyleCodes) => {
      if (responseStyleCodes) setStyleCodes(responseStyleCodes);
    });
  }, []);

  const populateStyleCodes = () => {
    console.log("The styleCodes are", styleCodes);
    return (
      <div>
        {styleCodes.map((styleCode) => (
          <div> {styleCode} </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {populateStyleCodes()}
      <PostIcon />
    </div>
  );
};

export default Home;
