import React from 'react';
import PropTypes from 'prop-types';

function User(props) {
  const { uimage } = props;
  return (
    <div>
      <img
        alt="画像なし"
        src={uimage}
      />
    </div>
  );
}

User.propTypes = {
  uimage: PropTypes.string.isRequired,
};

export default User;
