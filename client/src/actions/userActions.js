import axios from "axios";
import {
    GET_ERRORS,
    USER_ADD,
    USER_UPDATE,
    USER_INVITE
} from "./types";

axios.defaults.baseURL = 'https://striperouter.supelle.co/';

export const addUser = (userData, history) => dispatch => {
    axios
        .post("/anchor_api/user-add", userData)
        .then(res => {
                console.log('add success');
                dispatch({
                    type: USER_ADD,
                    payload: res,
                })
            }
        ).catch(err => {
                console.log('add failure');
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            }
        );
};


export const updateUser = (userData) => dispatch => {
    axios
        .post("/anchor_api/user-update", userData)
        .then(res =>
            dispatch({
                type: USER_UPDATE,
                payload: res,
            })
        ).catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


export const inviteUser = (userData) => dispatch => {
    axios
        .post("/anchor_api/user-invite", userData)
        .then(res =>
            dispatch({
                type: USER_INVITE,
                payload: res,
            })
        ).catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};
