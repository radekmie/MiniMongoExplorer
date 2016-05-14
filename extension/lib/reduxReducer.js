import { ADD, CHA, DEL, NEW, REM, SET } from './reduxConstants';

export default (state = {}, { type, payload }) => {
    let collection;

    switch (type) {
        case DEL: return {};
        case NEW: return { ...payload, tabs: [] };
        case SET: return { ...state, ...payload };

        case ADD:
            collection = state.snapshot[payload.snapshot.collection].slice();
            collection[payload.snapshot.options.index] = payload.snapshot.options.doc;

            return { ...state, ...payload, snapshot: { ...state.snapshot, [payload.snapshot.collection]: collection } };

        case CHA:
            collection = state.snapshot[payload.snapshot.collection].slice();
            collection[payload.snapshot.options.index] = payload.snapshot.options.doc;

            return { ...state, ...payload, snapshot: { ...state.snapshot, [payload.snapshot.collection]: collection } };

        case REM:
            collection = state.snapshot[payload.snapshot.collection].slice();
            collection.splice(payload.snapshot.options.index, 1);

            return { ...state, ...payload, snapshot: { ...state.snapshot, [payload.snapshot.collection]: collection } };

        default: return state;
    }
};
