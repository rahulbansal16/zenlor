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
const Home = () => {
  return (
    <div>
      <PostIcon />
    </div>
  );
};

export default Home;
