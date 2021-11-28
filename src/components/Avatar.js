import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Avatar = ({ name, uid, avatarId }) => {
  return (
    <Link to={`/profile/${uid}`} className="media-left">
      <img
        className="img-circle img-sm"
        alt={name}
        src={`https://bootdey.com/img/Content/avatar/avatar${avatarId}.png`}
      />
    </Link>
  );
};

Avatar.defaultProps = {
  name: "",
  avatarId: 1,
};

Avatar.propTypes = {
  name: PropTypes.string,
  avatarId: PropTypes.number,
};

export default Avatar;
