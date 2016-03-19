import { DEL, NEW, SET } from './reduxConstants';

export default (state = {}, { type, payload: { id, ...payload } = {} }) => {
    switch (type) {
        case DEL:
            return Object.keys(state)
                .reduce((rest, next) =>
                    next === id
                        ? rest
                        : ({ ...rest, [next]: state[next] })
                , {});

        case NEW:
            return { ...state, [id]: payload };

        case SET:
            return { ...state, [id]: { ...state[id], ...payload } };

        default:
            return state;
    }
};
