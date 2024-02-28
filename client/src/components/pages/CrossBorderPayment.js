import React, { Component, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import axios from "axios";
import { Link } from "react-router-dom";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons/faUserAlt";
import { faFileImport } from "@fortawesome/free-solid-svg-icons/faFileImport";
import { toast, ToastContainer } from "react-toastify";
import { Keypair } from "stellar-sdk";
import { useDebounce } from 'use-debounce';

export function isPrKey(strPrKey) {
    const regex = /^S[A-Z0-9]{55}$/;
    return regex.test(strPrKey);
}

const CrossBorderPayment = () => {

    const userId = useSelector(state => state.auth?.user?.id);
    
    const [firstNameOfSender, setFirstNameOfSender] = useState("");
    const [lastNameOfSender, setLastNameOfSender] = useState("");
    const [emailOfSender, setEmailOfSender] = useState("");
    const [bankAccountNumberOfSender, setBankAccountNumberOfSender] = useState("");
    const [routingNumberOfSender, setRoutingNumberOfSender] = useState("");

    const [firstNameOfReceiver, setFirstNameOfReceiver] = useState("");
    const [lastNameOfReceiver, setLastNameOfReceiver] = useState("");
    const [emailOfReceiver, setEmailOfReceiver] = useState("");
    const [bankAccountNumberOfReceiver, setBankAccountNumberOfReceiver] = useState("");
    const [routingNumberOfReceiver, setRoutingNumberOfReceiver] = useState("");

    return (
        <div>
            <Navbar />
            <div className="d-flex" id="wrapper">
                <Sidebar />
                <div id="page-content-wrapper">
                    <div className="container-fluid">
                        <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
                        <h1 className="mt-2 text-primary">Sender and receiver info</h1>
                        <div className="row px-2">
                            <div className="col-md-6 col-sm-12 p-sm-2">
                                <div className="card bg-primary text-white shadow-lg">
                                    <div className="card-body">
                                        <h5 className="card-title">Sender</h5>

                                        <p className="card-text">First name</p>
                                        <input className="card-text w-100 p-2" placeholder="Input first name of sender"
                                            value={firstNameOfSender}
                                            onChange={e => { setFirstNameOfSender(e.target.value) }}
                                        ></input>
                                        <br></br>
                                        
                                        <p className="card-text">Last name</p>
                                        <input className="card-text w-100 p-2" placeholder="Input last name of sender"
                                            value={lastNameOfSender}
                                            onChange={e => { setLastNameOfSender(e.target.value) }}
                                        ></input>
                                        <br></br>
                                        
                                        <p className="card-text">Email address</p>
                                        <input className="card-text w-100 p-2" placeholder="Input email address of sender"
                                            value={emailOfSender}
                                            onChange={e => { setEmailOfSender(e.target.value) }}
                                        ></input>
                                        <br></br>

                                        <p className="card-text">Bank account number</p>
                                        <input className="card-text w-100 p-2" placeholder="Input bank account number of sender"
                                            value={bankAccountNumberOfSender}
                                            onChange={e => { setBankAccountNumberOfSender(e.target.value) }}
                                        ></input>
                                        <br></br>

                                        <p className="card-text">Routing number</p>
                                        <input className="card-text w-100 p-2" placeholder="Input routing number of sender"
                                            value={routingNumberOfSender}
                                            onChange={e => { setRoutingNumberOfSender(e.target.value) }}
                                        ></input>
                                        <br></br>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row px-2">
                            <div className="col-md-6 col-sm-12 p-sm-2">
                                <div className="card bg-secondary text-white shadow-lg">
                                    <div className="card-body">
                                        <h5 className="card-title">Receiver</h5>

                                        <p className="card-text">First name</p>
                                        <input className="card-text w-100 p-2" placeholder="Input first name of receiver"
                                            value={firstNameOfReceiver}
                                            onChange={e => { setFirstNameOfReceiver(e.target.value) }}
                                        ></input>
                                        <br></br>

                                        <p className="card-text">Last name</p>
                                        <input className="card-text w-100 p-2" placeholder="Input last name of receiver"
                                            value={lastNameOfReceiver}
                                            onChange={e => { setLastNameOfReceiver(e.target.value) }}
                                        ></input>
                                        <br></br>

                                        <p className="card-text">Email address</p>
                                        <input className="card-text w-100 p-2" placeholder="Input email address of receiver"
                                            value={emailOfReceiver}
                                            onChange={e => { setEmailOfReceiver(e.target.value) }}
                                        ></input>
                                        <br></br>

                                        <p className="card-text">Routing number</p>
                                        <input className="card-text w-100 p-2" placeholder="Input routing number of receiver"
                                            value={routingNumberOfReceiver}
                                            onChange={e => { setRoutingNumberOfReceiver(e.target.value) }}
                                        ></input>
                                        <br></br>

                                        <p className="card-text">Bank account number</p>
                                        <input className="card-text w-100 p-2" placeholder="Input bank account number of receiver"
                                            value={bankAccountNumberOfReceiver}
                                            onChange={e => { setBankAccountNumberOfReceiver(e.target.value) }}
                                        ></input>
                                        <br></br>

                                        <div className="text-center">
                                            <button className="btn btn-light mt-3"
                                                style={{ width: "100px" }}
                                                /* onClick={() => saveGeneratedPair()} */
                                            >Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );

}

CrossBorderPayment.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(CrossBorderPayment);
