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

const CreateWallet = () => {

    const userId = useSelector(state => state.auth?.user?.id);
    const [importedPubKey, setImportedPubKey] = useState("");
    const [importingPrKey, setImportingPrKey] = useState("");
    const [debouncedPrKey] = useDebounce(importingPrKey, 500);
    const [generatedPrKey, setGeneratedPrKey] = useState("");
    const [generatedPubKey, setGeneratedPubKey] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (debouncedPrKey !== undefined && debouncedPrKey?.length !== 0 && debouncedPrKey !== null) {
            if (isPrKey(debouncedPrKey)) {
            } else {
                setImportedPubKey("");
                return;
            }
            try {
                const keypair = Keypair.fromSecret(importingPrKey);
                const publicKey = keypair.publicKey();
                setImportedPubKey(publicKey);
            } catch (e) {
                setErrorMessage(
                    `Invalid secret key. Secret keys are uppercase and begin with the letter "S."`,
                );
            }
        }
    }, [debouncedPrKey])

    const importFromPrKey = () => {
        if (debouncedPrKey !== undefined && debouncedPrKey?.length !== 0 && debouncedPrKey !== null) {
            if (isPrKey(debouncedPrKey)) {
            } else {
                toast.warn("The secrete key is invalid.");
                return;
            }
        }
        axios.post(`${process.env.REACT_APP_BACKEND}/anchor_wallet_api/wallet-add`, {
            pubKey: importedPubKey,
            prKey: debouncedPrKey,
            userId: userId
        }).then(response => {
            console.log(response);
            toast.success("Wallet added successfully!");
        }).catch(err => {
            console.error(err);
        });
    }

    const generatePair = () => {
        try {
            const keypair = Keypair.random();
            setGeneratedPubKey(keypair.publicKey());
            setGeneratedPrKey(keypair.secret());
        } catch (err) {
            console.error(err);
        }
    }

    const saveGeneratedPair = () => {
        if (generatedPrKey !== undefined && generatedPrKey?.length !== 0 && generatedPrKey !== null) {
            if (isPrKey(generatedPrKey)) {
            } else {
                toast.warn("The secrete key is invalid.");
                return;
            }
        }
        axios.post(`${process.env.REACT_APP_BACKEND}/anchor_wallet_api/wallet-add`, {
            prKey: generatedPrKey,
            pubKey: generatedPubKey,
            userId: userId
        }).then(response => {
            console.log(response);
            toast.success("Wallet saved successfully!");
        }).catch(err => {
            console.error(err);
        });
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
                            <div className="col-md-6 col-sm-12 p-sm-2">
                                <div className="card bg-primary text-white shadow-lg">
                                    <div className="card-body">
                                        <h5 className="card-title">Import from private key</h5>
                                        <p className="card-text ">YOUR SECRET KEY</p>
                                        <input className="card-text w-100 p-2" placeholder="Starts with S, example: SCHK...ZLJK"
                                            value={importingPrKey}
                                            onChange={e => { setImportingPrKey(e.target.value) }}
                                        ></input>
                                        <br></br>
                                        <input className="card-text w-100 p-2 mt-3 " placeholder="Public key"
                                            value={importedPubKey}
                                            disabled
                                        ></input>
                                        <br></br>
                                        <button className="btn btn-light mt-3 "
                                            style={{ width: "100px" }}
                                            onClick={() => importFromPrKey()}
                                        >Import</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row px-2">
                            <div className="col-md-6 col-sm-12 p-sm-2">
                                <div className="card bg-secondary text-white shadow-lg">
                                    <div className="card-body">
                                        <h5 className="card-title">Generate key pair</h5>
                                        <p className="card-text">Generate and import your wallet.</p>
                                        <button className="btn btn-light  "
                                            style={{ width: "100px" }}
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

                                        <button className="btn btn-light mt-3 "
                                            style={{ width: "100px" }}
                                            onClick={() => saveGeneratedPair()}
                                        >Save</button>
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
