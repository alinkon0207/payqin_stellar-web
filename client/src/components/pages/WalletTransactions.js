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

class WalletTransacions extends Component {

    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "hash",
                text: "Hash",
                className: "hash",
                align: "left",
                sortable: true,
            },
            {
                key: "created_at",
                text: "Date",
                className: "created_at",
                align: "left",
                sortable: true,
            },
            {
                key: "ledger",
                text: "Ledger",
                className: "ledger",
                align: "left",
                sortable: true,
            },
            {
                key: "successful",
                text: "Status",
                className: "successful",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <div>
                            {record?.successful?.toString()}
                        </div>
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
            let trx_response = await axios.get(`https://horizon-futurenet.stellar.org/accounts/${match.params.wallet}/transactions`);
            console.log("trx_response  >>> ", trx_response);
            this.setState({ records: trx_response.data?._embedded?.records })
        } catch (err) {
            console.error(err);
        }
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
                    <div className="container-fluid">
                        <button className="btn btn-link mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
                        <h1 className="mt-2 text-primary">Wallet Transactions</h1>
                        <ReactDatatable
                            config={this.config}
                            records={this.state.records}
                            columns={this.columns}
                            onPageChange={this.pageChange.bind(this)}
                        />
                    </div>
                    <ToastContainer />
                </div>
            </div>
        );
    }

}

WalletTransacions.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps,
    { deleteMessage }
)(WalletTransacions);
