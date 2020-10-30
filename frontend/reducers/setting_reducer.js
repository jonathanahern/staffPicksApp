import {
    RECEIVE_SETTING
} from '../actions/setting_actions.js';

const SettingsReducer = (oldState = {}, action) => {
    Object.freeze(oldState);
    
    switch (action.type) {
      case RECEIVE_SETTING:
        return Object.assign({}, action.setting);
      default:
        return oldState;
    }
};

export default SettingsReducer;