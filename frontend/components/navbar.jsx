import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return(
            <>
                <div className="nav-bar-container">
                    <Link className="nav-bar-link" to={`/staff`}><div className="link-underline"></div>Staff</Link>
                    <Link className="nav-bar-link" to={`/picks`}><div className="link-underline"></div>Picks</Link>
                    <Link className="nav-bar-link" to={`/settings`}><div className="link-underline"></div>Settings/Setup</Link>
                </div>
            </>
        );
    }
}

export default NavBar;