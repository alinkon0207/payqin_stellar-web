import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {Link} from "react-router-dom";
import {faUserAlt} from "@fortawesome/free-solid-svg-icons/faUserAlt";
import { inviteUser } from "../../actions/userActions";
import classnames from "classnames";
import { toast, ToastContainer} from "react-toastify";

class Invite extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            permissions: ['view'],
            note: "",
            errors: {}
        };
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSelectChange = e => {
        const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
        this.setState({ [e.target.id]: selectedValues });
    };

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            permissions: this.state.permissions.toString(),
            note: this.state.note
        };
        this.props.inviteUser(userData);
    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList}/></button>
                            <h1 className="mt-2 text-primary">Invite</h1>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-4 mx-auto mt-5 card shadow-lg">
                                        <div className="card-body p-1">
                                            <form noValidate onSubmit={this.onSubmit} className="white">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    onChange={this.onChange}
                                                    value={this.state.email}
                                                    error={errors.email}
                                                    id="email"
                                                    type="email"
                                                    className={classnames("form-control", {
                                                        invalid: errors.email
                                                    })}
                                                />
                                                <span className="text-danger">{errors.email}</span>
                                                <br/>
                                                <label htmlFor="permissions">Permissions</label>
                                                <br/>
                                                <select multiple
                                                    onChange={this.onSelectChange}
                                                    value={this.state.permissions}
                                                    error={errors.permissions}
                                                    id="permissions"
                                                    className={classnames("form-control", {
                                                        invalid: errors.permissions
                                                    })}
                                                >
                                                    <option value="view">View accounts</option>
                                                    <option value="create">Create accounts</option>
                                                    <option value="pay">Cross-border pay</option>
                                                </select>
                                                <br/>
                                                <label htmlFor="Note">Note</label>
                                                <textarea
                                                    onChange={this.onChange}
                                                    value={this.state.note}
                                                    id="note"
                                                    className={classnames("form-control", {})}
                                                />
                                                <span className="text-danger">{errors.password}</span>
                                                <p className="text-center pb-0 mt-2">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-large btn-primary mt-2 px-5">
                                                        Invite
                                                    </button>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Invite.propTypes = {
    inviteUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { inviteUser }
)(Invite);
