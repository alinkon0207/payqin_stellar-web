import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteMessage } from "../../actions/authActions";
import axios from "axios";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserAddModal from "../partials/UserAddModal";
import UserUpdateModal from "../partials/UserUpdateModal";
import { toast, ToastContainer } from "react-toastify";

class UserWallets extends Component {

    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "_id",
                text: "Id",
                className: "id",
                align: "left",
                sortable: true,
            },
            {
                key: "pubKey",
                text: "Wallet Address",
                className: "pubKey",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <div className="">{this.showShortifyedWalletAddress(record?.pubKey)}</div>
                    );
                }
            },
            {
                key: "user",
                text: "Owner",
                className: "user",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <div className="">{record?.user?.email}</div>
                    );
                }
            },
            {
                key: "balances",
                text: "Balances",
                className: "balances",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => this.props.history.push(`/wallet_balances/${record?.pubKey}`)}
                                style={{ marginRight: '5px' }}>
                                <i className="fa fa-balance-scale mr-2" aria-hidden="true">
                                </i>
                                Details
                            </button>
                        </Fragment>
                    );
                }
            },
            {
                key: "details",
                text: "Transactions",
                className: "details",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => this.props.history.push(`/wallet_transactions/${record?.pubKey}`)}
                                style={{ marginRight: '5px' }}>
                                <i className="fa fa-info mr-2" aria-hidden="true">
                                </i>
                                Details
                            </button>
                        </Fragment>
                    );
                }
            },
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Users",
            no_data_text: 'No user found!',
            button: {
                excel: true,
                print: true,
                csv: true
            },
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: "Previous",
                    next: "Next",
                    last: "Last"
                }
            },
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.state = {
            records: []
        };

        this.state = {
            currentRecord: {
                id: '',
                name: '',
                email: '',
                password: '',
                password2: '',
                permissions: ''
            }
        };

        this.getData = this.getData.bind(this);
        this.showShortifyedWalletAddress = this.showShortifyedWalletAddress.bind(this);
    }

    componentDidMount() {
        this.getData()
    };

    componentWillReceiveProps(nextProps) {
        this.getData()
    }

    showShortifyedWalletAddress(strWallet) {

        if (strWallet?.toString()?.length >= 56) {
            let temp = strWallet;
            temp = temp?.toString()?.substring(0, 5) + "..." + temp?.toString()?.substring(51, 56);
            return temp;
        }
        return strWallet;
    }

    getData() {
        axios
            .post("/anchor_wallet_api/wallet-data")
            .then(res => {
                console.log(res);
                this.setState({ records: res.data })
            })
            .catch()
    }

    editRecord(record) {
        this.setState({ currentRecord: record });
    }

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <UserAddModal />
                    <UserUpdateModal record={this.state.currentRecord} />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-user-modal"><FontAwesomeIcon icon={faPlus} /> Add User</button>
                            <h1 className="mt-2 text-primary">User Wallets</h1>
                            <ReactDatatable
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                onPageChange={this.pageChange.bind(this)}
                            />
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        );
    }

}

UserWallets.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps,
    { deleteMessage }
)(UserWallets);
