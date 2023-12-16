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
import { toast, ToastContainer } from "react-toastify";

class WalletBalances extends Component {

    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "asset_type",
                text: "Token",
                className: "token",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <div>
                            {(record?.asset_code === "" || record?.asset_code === null || record?.asset_code === undefined) ? "XLM" : record?.asset_code?.toString()}
                        </div>
                    );
                }
            },
            {
                key: "balance",
                text: "Balance",
                className: "balance",
                align: "left",
                sortable: true,
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


        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    };

    componentWillReceiveProps(nextProps) {
        this.getData()
    }


    async getData() {
        try {
            const { match } = this.props;
            const wallet = match?.params?.wallet;
            let trx_response = await axios.get(`https://horizon.stellar.org/accounts/${wallet}`);
            console.log("trx_response  >>> ", trx_response);
            this.setState({ records: trx_response.data?.balances })
        } catch (err) {
            console.error(err);
        }
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
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
                            <h1 className="mt-2 text-primary">Wallet Balances</h1>
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

WalletBalances.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps,
    { deleteMessage }
)(WalletBalances);
