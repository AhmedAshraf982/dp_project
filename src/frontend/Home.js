import React, { Component } from 'react';
import Header from './Header'
import CurrentEvent from './CurrentEvent';
import background from '../images/bg.jpeg';
import Backdrop from './Backdrop';
import Signup from './Signup';
import SuperTab from './SuperTab';
import Slider from './Slider';
import axios from 'axios';
import Footer from './Footer';
import { Cards } from './Cards';
import CurrentSlider from './CurrentSlider';

const urls = ["https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", background]
class Home extends Component {
  state = {
    sideDrawerOpen: false,
    isLogin: true,
    recentEvent: [],

  };
  drawerEvent = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    });
  }

  backdropEvent = () => {
    this.setState({ sideDrawerOpen: false });
  };

  componentDidMount = async () => {
    let res = await axios({
      method: "GET",
      url: "http://localhost:4500/recentEvent"
    });
    this.setState({ recentEvent: [...this.state.recentEvent, ...res.data] })
  }

  render() {
    let backdrop;
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropEvent} />
    }
    return (
      <div>
        <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css' />
        <Header drawerEvent={this.drawerEvent} />
        <div style={{ height: "120vh", backgroundImage: `linear-gradient(to right bottom, rgba(0, 32, 91, 0.2), rgba(4, 30, 66, 0.4)), url('${background}')`, backgroundSize: "cover" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "90%" }}>
              <text style={{ color: "white", fontSize: 80, color: "#E9072B", fontWeight: "bold", fontFamily: "Roboto", letterSpacing: 10, position: "absolute", top: "40%", left: "5%" }}>GAMING BATTLES</text>
              <div style={{ marginTop: 20 }}>
                <p style={{ color: "grey", fontFamily: "Roboto", top: "60%", left: "5%", position: "absolute", fontSize: 20, fontWeight: "bold" }}>Compete with top ranked teams to take<span style={{ color: "dark-grey" }}> your skills to the next level!</span></p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 50 }}>
          <div style={{ width: "90%" }}>
            <div style={{ borderLeftWidth: 6, borderLeftColor: "#E9072B" }}>
              <text style={{ fontSize: 40, fontFamily: "Roboto", fontWeight: "bold", paddingLeft: 20 }}>Upcoming Events</text>
            </div>
            <CurrentSlider/>
          </div>
        </div>
        {/* text */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 150, backgroundColor: "#041E42", width: "100%" }}>
          <div style={{ width: "90%", marginBottom: 100 }}>
            <div style={{ borderLeftWidth: 6, borderLeftColor: "#E9072B", marginTop: 100 }}>
              <text style={{ fontSize: 40, fontFamily: "Roboto", fontWeight: "bold", paddingLeft: 20, color: "white" }}>Ongoing events</text>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "80%" }}>
                  <Slider  />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 50 }}>
          <div style={{ width: "90%" }}>
            <div style={{ borderLeftWidth: 6, borderLeftColor: "#E9072B" }}>
              <text style={{ fontSize: 40, fontFamily: "Roboto", fontWeight: "bold", paddingLeft: 20 }}>Explore More</text>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "90%", marginTop: 40 }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {urls.map((url, index) => (
                <Cards url={url} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
        <link rel={"stylesheet"} href={"./style.css"} />
        <div id="particles-js"></div>
        <script type={"text/javascript"} src={"./particles.js"}></script>
        <script type={"text/javascript"} src={"./app.js"}></script>
        <div style={{ position: "absolute", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SuperTab show={this.state.sideDrawerOpen} />
        </div>
        {backdrop}
      </div>
    );
  }
}

export default Home;

