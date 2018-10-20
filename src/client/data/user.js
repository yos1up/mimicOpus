import Immutable from 'immutable';

const User = Immutable.Record({
  username: 'anonymous',
  rating: 0,
});

export default User;
