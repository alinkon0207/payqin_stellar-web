import {
    DELETE_MESSAGE,
    SET_CURRENT_USER,
    USER_ADD,
    USER_LOADING,
    USER_UPDATE,
    USER_INVITE
} from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
};
export default function(state = initialState, action) {
    switch (action.type) {
        case USER_ADD:
            return {
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_UPDATE:
            return {
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload,
            };
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        case USER_INVITE:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case DELETE_MESSAGE:
            let new_data = {
                ...state.user.data ? state.user.data : {},
                message: undefined
            };
            let new_user = {
                ...state.user ? state.user : {},
                data: new_data
            };
            return {
                ...state,
                user: new_user
            };
        default:
            return state;
    }
}
