import {userActionTypes} from './user.types';

const INITIAL_STATE = {
    currentUser:null,
    data:null
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case userActionTypes.SET_CURRENT_USER :
            return {
                ...state,
                currentUser:action.payload,
            }
        case userActionTypes.SET_DATA:
            return {
                ...state,
                data:action.payload
            }
        default:
            return state;
    }
}

export default userReducer;