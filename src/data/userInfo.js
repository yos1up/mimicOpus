import Immutable from 'immutable';

class UserInfo extends Immutable.Record({
  uid: '',
  name: 'unonymous',
  uimage: '',
}) {
}

export default UserInfo;
