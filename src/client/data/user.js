import Immutable from 'immutable';

const User = Immutable.Record({
  displayName: 'anonymous',
  rating: 0,
});

export default User;
