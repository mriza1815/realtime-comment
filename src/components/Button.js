import React from "react";
import PropTypes from "prop-types";
import FirebaseLibrary from "../library/firebase";
import { connect } from "react-redux";

const Button = ({ type, onClick, uid, commentId, active, user }) => {
  const {
    followUser,
    unfollowUser,
    addReaction,
    deleteReaction,
    deleteComment,
  } = FirebaseLibrary();

  const renderFollowBtn = () => {
    return (
      <button
        className="btn btn-xs btn-primary mr-05"
        type="submit"
        onClick={() => followUser(uid)}
      >
        Follow{" "}
      </button>
    );
  };

  const renderUnfollowBtn = () => {
    return (
      <button
        className="btn btn-xs btn-default mr-05"
        type="submit"
        onClick={() => unfollowUser(uid)}
      >
        Unfollow <i className="fa fa-times" aria-hidden="true" />
      </button>
    );
  };

  const renderLikeBtn = () => {
    return (
      <a
        className={`btn btn-sm btn-default btn-hover-success ${
          active ? "btn-active" : ""
        }`}
        onClick={() =>
          active
            ? deleteReaction(commentId, "like")
            : addReaction(commentId, "like")
        }
      >
        <i className="fa fa-thumbs-up" />
      </a>
    );
  };

  const renderUnlikeBtn = () => {
    return (
      <a
        className={`btn btn-sm btn-default btn-hover-danger ${
          active ? "btn-active" : ""
        }`}
        onClick={() =>
          active
            ? deleteReaction(commentId, "unlike")
            : addReaction(commentId, "unlike")
        }
      >
        <i className="fa fa-thumbs-down" />
      </a>
    );
  };

  const renderReplyBtn = () => {
    return (
      <a
        className="btn btn-sm btn-default btn-hover-primary reply-btn"
        href="#"
        onClick={onClick}
      >
        Reply{" "}
      </a>
    );
  };

  const renderDeleteBtn = () => {
    return (
      <a
        className="btn btn-sm btn-default btn-hover-success delete-btn"
        onClick={() => deleteComment(commentId)}
      >
        <i className="fa fa-times" />
      </a>
    );
  };

  const renderBtn = () => {
    if (!user) return null;
    if (type === "follow") return renderFollowBtn();
    else if (type === "unfollow") return renderUnfollowBtn();
    else if (type === "like") return renderLikeBtn();
    else if (type === "unlike") return renderUnlikeBtn();
    else if (type === "reply") return renderReplyBtn();
    else if (type === "delete") return renderDeleteBtn();
  };

  return <>{renderBtn()}</>;
};

Button.propTypes = {
  type: PropTypes.oneOf([
    "follow",
    "unfollow",
    "like",
    "unlike",
    "reply",
    "delete",
  ]).isRequired,
  onClick: PropTypes.func,
  uid: PropTypes.string,
  reaction: PropTypes.string,
  active: PropTypes.bool,
};

Button.defaultProps = {
  onClick: null,
  uid: null,
  reaction: null,
  active: false,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Button);
