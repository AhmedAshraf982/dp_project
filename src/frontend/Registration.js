import React, { Component } from 'react';
import Header from './Header'
import background from '../images/bg.jpeg';
import Backdrop from './Backdrop';
import SuperTab from './SuperTab';
import axios from 'axios';
import './Usercard.css'
import Slider from './Slider';
import Footer from './Footer';
import { Cards } from './Cards';
import Form from './Form';
import Leaderboard from './LeaderBoard';
import CurrentSlider from './CurrentSlider';
import { withRouter } from 'react-router-dom';
import './Registration.css';
const urls = ["https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", background]


class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            clickedEvent: [],
            id: 0,
            name: "",
            user: [],
            count: 0,
            leaderboard: [],
            sideDrawerOpen: false,
            loop: []
        }
    }
    drawerEvent = () => {
        this.setState((prevState) => {
            return { sideDrawerOpen: !prevState.sideDrawerOpen }
        });
    }

    backdropEvent = () => {
        this.setState({ sideDrawerOpen: false });
    };
    componentDidUpdate() {
        const id = this.props.location.search.split("id=")[1].split("&")[0];
        if (this.state.id != id) {
            this.setState({ id: id });
            this.componentDidMount();
        }
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        const id = this.props.location.search.split("id=")[1].split("&")[0];
        const name = this.props.location.search.split("name=")[1];
        this.state.id = id;
        this.state.name = name;
        let res = await axios({
            method: "GET",
            url: `http://localhost:4500/registeredPlayers/${id}`
        });
        if (res.data.length) {
            this.state.count = res.data[0].count;
        }
        console.log("count:", this.state.count);
        res = await axios({
            method: "GET",
            url: "http://localhost:4500/events"
        });
        this.setState({ events: [...this.state.events, ...res.data] })
        console.log(this.state.events);
        res = await axios({
            method: "GET",
            url: "http://localhost:4500/maxplayers/" + id
        });
        for (let i = 0; i < res.data[0].maxplayers; i++) {
            this.state.loop.push(i);
        }
        console.log("loop:", this.state.loop);
        res = await axios({
            method: "GET",
            url: `http://localhost:4500/eventinfo/${id}`
        });
        this.setState({ clickedEvent: [res.data] })
        console.log("here", this.state.clickedEvent);
        res = await axios({
            method: "GET",
            url: `http://localhost:4500/playerprofile/${name}`
        });
        this.setState({ user: res.data.data.docs })
        console.log("userobject:", this.state.user[0]);
    }
    drawerEvent = () => {
        this.setState((prevState) => {
            return { sideDrawerOpen: !prevState.sideDrawerOpen }
        });
    }

    backdropEvent = () => {
        this.setState({ sideDrawerOpen: false });
    };
    register = async (e) => {
        // console.log(this.state.id, this.state.name);
        // try {
        //     e.preventDefault();
        //     const data = {
        //         tour_id: this.state.id,
        //         id: this.state.user[0].id
        //     }
        //     const res = await axios({
        //         method: "POST",
        //         url: "http://localhost:4500/regUserEvent",
        //         data,
        //     });
        //     if (res.data.status === "success") {
        //         //redirect to dashboard
        //         alert(res.data.status);
        //     } else {
        //         throw new Error("Email and Password does not exist");
        //     }
        // } catch (err) {
        //     alert(err.message);
        // }
    }
    cancelRegistration = async (e) => {
        console.log(this.state.id, this.state.name);
        try {
            e.preventDefault();
            const data = {
                tour_id: this.state.id,
                id: this.state.user[0].id
            }
            const res = await axios({
                method: "POST",
                url: "http://localhost:4500/cancelReg",
                data,
            });
            if (res.data.status === "success") {
                //redirect to dashboard
                alert(res.data.status);
            } else {
                throw new Error("Email and Password does not exist");
            }
        } catch (err) {
            alert(err.message);
        }
    }
    render() {
        let backdrop;
        if (this.state.sideDrawerOpen) {
            backdrop = <Backdrop click={this.backdropEvent} />
        }
        return (
            <div>
                <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css' />
                {
                    this.state.name != "undefined" ? <Header drawerEvent={this.drawerEvent} logged={true} name={this.state.name} /> : <Header drawerEvent={this.drawerEvent} logged={false} name={this.state.name} />
                }
                <div style={{ height: "120vh", backgroundImage: `linear-gradient(to right bottom, rgba(0, 32, 91, 0.2), rgba(4, 30, 66, 0.4)), url('${background}')`, backgroundSize: "cover" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ marginTop: 100, width: "90%", height: "100vh", backgroundColor: "white", display: "flex", justifyContent: "space-between", borderRadius: 10 }}>
                            {
                                this.state.clickedEvent.map((event, index) => (
                                    <div style={{ display: "flex", width: "100%", flexDirection: "column", height: "100%", marginTop: 70 }}>
                                        <div style={{ borderLeftWidth: 6, borderLeftColor: "#E9072B", marginLeft: 50 }}>
                                            <text style={{ fontSize: 40, fontFamily: "Roboto", fontWeight: "bold", paddingLeft: 20, color: "#041E42" }}>Event Registration</text>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", marginTop: 30 }}>
                                            <div class="ex1" style={{ display: "flex", flexDirection: "column", borderRadius: 10 }}>
                                                <text style={{ marginLeft: "5%", color: "white", fontSize: 30, fontWeight: "bold", marginTop: 20 }}>{event.tour_name}</text>
                                                <text style={{ marginLeft: "5%", color: "white", fontSize: 20, fontWeight: "bold" }}>{"Team Information:"}</text>
                                                <text style={{ marginLeft: "5%", color: "white", marginTop: 20 }}>Team Name: </text>
                                                <Form maxplayers={parseInt(event.maxplayers)} tour_id={event.id}/>
                                                <div style={{ marginTop: 40, justifyContent: "flex-end", alignItems: "center", display: "flex", padding: 20 }}>
                                                    <button class="btn btn-outline-secondary" style={{ backgroundColor: "#E9072B", color: "white", marginRight: "5%" }} onClick={this.register}>Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 50 }}>
                    <div style={{ width: "90%" }}>
                        <div style={{ borderLeftWidth: 6, borderLeftColor: "#E9072B" }}>
                            <text style={{ fontSize: 40, fontFamily: "Roboto", fontWeight: "bold", paddingLeft: 20 }}>Upcoming Events</text>
                        </div>
                        <CurrentSlider name={this.state.name} />
                    </div>
                </div>
                {
                    this.state.clickedEvent.map((event, index) => (
                        <Leaderboard id={event.id} />
                    ))
                }

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 150, backgroundColor: "#041E42", width: "100%" }}>
                    <div style={{ width: "90%", marginBottom: 100 }}>
                        <div style={{ borderLeftWidth: 6, borderLeftColor: "#E9072B", marginTop: 100 }}>
                            <text style={{ fontSize: 40, fontFamily: "Roboto", fontWeight: "bold", paddingLeft: 20, color: "white" }}>More on going events</text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "80%" }}>
                                {this.state.clickedEvent.map((event, index) => (
                                    <Slider id={this.state.id} name={this.state.name} />
                                ))}
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

export default withRouter(Registration);