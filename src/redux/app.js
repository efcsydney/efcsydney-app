import {createAction, handleActions} from 'redux-actions';

//=================
// Action Creators
//=================
export const changeOrientation = createAction(`CHANGE_ORIENTATION`, (orientation) => orientation);

//=================
// Reducer
//=================
const defaultState = {
  orientation: 'portrait'
};
const reducer = handleActions({
  [changeOrientation]: (state, {payload}) => {
    state.orientation = payload;
    return state;
  }
}, defaultState);

export default reducer;
