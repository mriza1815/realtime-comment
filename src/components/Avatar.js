import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Avatar = ({ name, uid, avatarId, avatar }) => {
  return (
    <Link to={`/profile/${uid}`} className="media-left">
      <img
        className="img-circle img-sm"
        alt={name}
        referrerpolicy="no-referrer"
        src={
          avatar
            ? avatar
            : `https://bootdey.com/img/Content/avatar/avatar${avatarId}.png`
        }
      />
    </Link>
  );
};

Avatar.defaultProps = {
  name: "",
  avatarId: 1,
  avatar: null,
};

Avatar.propTypes = {
  name: PropTypes.string,
  avatarId: PropTypes.number,
  avatar: PropTypes.string,
};

export default Avatar;
