import * as actions from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  didInvalidate: false,
  items: []
}

const posts = (state = initialState, action) => {
  switch (action.type) {

    default:
      return state;
  }
};

export default posts;
