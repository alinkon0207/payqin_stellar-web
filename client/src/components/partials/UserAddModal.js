import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addUser } from "../../actions/userActions";
import { deleteMessage } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';

import 'react-toastify/dist/ReactToastify.css';

class UserAddModal extends React.Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            permissions: ['view'],
            errors: {},
        };
    }

    componentWillMount(props) {
        this.setState({
            name: '',
            email: '',
            password: '',
            password2: '',
            permissions: []
        });
        if (props?.errors) {
            this.setState({
                errors: {}
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps called!');
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if (nextProps.auth !== undefined
                && nextProps.auth.user !== undefined
                && nextProps.auth.user.data !== undefined
                && nextProps.auth.user.data.message !== undefined) {
            $('#add-user-modal').modal('hide');
            console.log('toast on add');
            
            let oldNotify = localStorage.getItem("notify");
            let newNotify = JSON.stringify(nextProps.auth.user);
            if (oldNotify !== newNotify) {
                localStorage.setItem("notify", newNotify);
            
                toast(nextProps.auth.user.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
    
                this.props.deleteMessage();
            }
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSelectChange = e => {
        const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
        this.setState({ [e.target.id]: selectedValues });
    };

    onUserAdd = e => {
        console.log('adding user...');
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
            permissions: this.state.permissions.toString()
        };
        this.props.addUser(newUser, this.props.history);
    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-user-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add User</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onUserAdd} id="add-user">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.name}
                                                id="name"
                                                type="text"
                                                error={errors.name}
                                                className={classnames("form-control", {
                                                    invalid: errors.name
                                                })}/>
                                            <span className="text-danger">{errors.name}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="email">Email</label>
                                        </div>
                                        <div className="col-md-9">
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
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="password">Password</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.password}
                                                error={errors.password}
                                                id="password"
                                                type="password"
                                                className={classnames("form-control", {
                                                    invalid: errors.password
                                                })}
                                            />
                                            <span className="text-danger">{errors.password}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="password2">Confirm Password</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                autoComplete={''}
                                                onChange={this.onChange}
                                                value={this.state.password2}
                                                error={errors.password2}
                                                id="password2"
                                                type="password"
                                                className={classnames("form-control", {
                                                    invalid: errors.password2
                                                })}
                                            />
                                            <span className="text-danger">{errors.password2}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="permissions">Permissions</label>
                                        </div>
                                        <div className="col-md-9">
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
                                            <span className="text-danger">{errors.permissions}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-user"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

UserAddModal.propTypes = {
    addUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addUser, deleteMessage }
)(withRouter(UserAddModal));
