import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';

function Profile(props) {
  const { userInfo } = props;
  return (
    <div>
      <img
        alt="画像なし"
        src={userInfo.uimage}
      />
    </div>
  );
}

Profile.propTypes = {
  userInfo: PropTypes.instanceOf(Immutable.Record).isRequired,
};

export default Profile;
