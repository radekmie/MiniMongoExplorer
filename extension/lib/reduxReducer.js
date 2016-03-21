import { DEL, NEW, SET } from './reduxConstants';

export default (state = {}, { type, payload }) => {
    switch (type) {
        case DEL: return {};
        case NEW: return payload;
        case SET: return { ...state, ...payload };

        default: return state;
    }
};
