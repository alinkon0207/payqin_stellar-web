import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import axios from "axios";
import { Link } from "react-router-dom";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons/faUserAlt";
import { faFileImport } from "@fortawesome/free-solid-svg-icons/faFileImport";
import { toast } from "react-toastify";
import { Keypair } from "stellar-sdk";

export function isPrKey(strPrKey) {
    ///check validation of private key
    //start with S and has capitalized A-Z, has digits 0~9 and has length of 56 chars
    const regex = /^S[A-Z0-9]{55}$/;
    return regex.test(strPrKey);
}

const CreateWallet = () => {

    const [importedPubKey, setImportedPubKey] = useState("");
    const [importingPrKey, setImportingPrKey] = useState("");
    const [generatedPrKey, setGeneratedPrKey] = useState("");
    const [generatedPubKey, setGeneratedPubKey] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const importFromPrKey = () => {
        if (importingPrKey !== undefined && importingPrKey?.length !== 0 && importingPrKey !== null) {
            if (isPrKey(importingPrKey)) {
            } else {
                toast.warn("The secrete key is invalid.");
                return;
            }
        }
        try {
            const keypair = Keypair.fromSecret(importingPrKey);
            const publicKey = keypair.publicKey();
            setImportedPubKey(publicKey);
            console.log("pubKey >>> ", publicKey);

        } catch (e) {
            setErrorMessage(
                `Invalid secret key. Secret keys are uppercase and begin with the letter "S."`,
            );
        }
    }

    const generatePair = () => {

    }

    return (
        <div>
            <Navbar />
            <div className="d-flex" id="wrapper">
                <Sidebar />
                <div id="page-content-wrapper">
                    <div className="container-fluid">
                        <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
                        <h1 className="mt-2 text-primary">Create a wallet</h1>
                        <div className="row px-2">
                            <div className="col-sm-3 p-sm-2">
                                <div className="card bg-primary text-white shadow-lg">
                                    <div className="card-body">
                                        <h5 className="card-title">Import from private key</h5>
                                        <p className="card-text ">YOUR SECRET KEY</p>
                                        <input className="card-text w-100 p-2" placeholder="Starts with S, example: SCHK...ZLJK"
                                            value={importingPrKey}
                                            onChange={e => {setImportingPrKey(e.target.value)}}
                                        ></input>
                                        <br></br>
                                        <input className="card-text w-100 p-2 mt-3 " placeholder="Public key"
                                            value={importedPubKey}
                                            disabled
                                        ></input>
                                        <br></br>
                                        <button className="btn btn-light mt-3 "
                                            onClick={() => importFromPrKey()}
                                        ><FontAwesomeIcon className="text-primary" icon={faFileImport} />&nbsp;Import</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 p-sm-2">
                                <div className="card bg-secondary text-white shadow-lg">
                                    <div className="card-body">
                                        <h5 className="card-title">Generate key pair</h5>
                                        <p className="card-text">Generate and import your wallet.</p>
                                        <button className="btn btn-light  "
                                            onClick={() => generatePair()}
                                        >Generate</button>

                                        <input className="card-text w-100 p-2 mt-3 " placeholder="Secret Key"
                                            value={generatedPrKey}
                                            disabled
                                        ></input>
                                        <br></br>

                                        <input className="card-text w-100 p-2 mt-3 " placeholder="Public key"
                                            value={generatedPubKey}
                                            disabled
                                        ></input>
                                        <br></br>

                                        <button className="btn btn-light mt-3 "><FontAwesomeIcon className="text-primary" icon={faFileImport} />&nbsp;Create</button>
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

CreateWallet.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(CreateWallet);
