import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { connect, useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";

const Sidebar = () => {

    const dispatch = useDispatch();

    const onLogoutClick = e => {
        e.preventDefault();
        dispatch(logoutUser());
    };

    return (
        <div className="border-right h-100" id="sidebar-wrapper">
            <div className="list-group list-group-flush">
                <Link to="/dashboard" className="list-group-item list-group-item-action">Dashboard</Link>
                <Link to="/users" className="list-group-item list-group-item-action">Users</Link>
                <Link to="/invite" className="list-group-item list-group-item-action">Invite</Link>
                <Link to="/user_wallets" className="list-group-item list-group-item-action">User Wallets</Link>
                <Link to="/create_wallet" className="list-group-item list-group-item-action">Create wallet</Link>
                <Link to="/cross_border_payment" className="list-group-item list-group-item-action">Cross-Border Payment</Link>
                <button className="list-group-item list-group-item-action" onClick={(e) => onLogoutClick(e)}>Logout <FontAwesomeIcon icon={faSignOutAlt} /></button>
            </div>
        </div>
    );
}

export default Sidebar;