import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import Button from "./Button";
import WriteComment from "./WriteComment";
import { onValue, ref, getDatabase } from "firebase/database";
import { Link } from "react-router-dom";
import { timeDifference } from "../library/general-utils";
import { connect } from "react-redux";

const Comment = ({
  person,
  timestamp,
  comment,
  id,
  isMe,
  following,
  uid,
  reaction,
  avatarId,
  replies,
  followings,
  reactions,
  currentUserUid,
  isReply,
  isAdmin,
}) => {
  const [openReplyArea, setOpenReplyArea] = useState(false);

  useEffect(() => {
    listenReplies();
  }, []);

  const listenReplies = () => {
    onValue(ref(getDatabase(), `comments/${id}/`), (snapshot) => {
      const data = snapshot.val();
      console.log("replies", data, `comments/${id}`);
    });
  };

  return (
    <div className="media-block pb-2">
      {isAdmin ? <Button type="delete" commentId={id} /> : null}
      <Avatar uid={uid} avatarId={avatarId} />
      <div className="media-body">
        <div className="mar-btm">
          <Link
            to={`/profile/${uid}`}
            className="btn-link text-semibold media-heading box-inline"
          >
            {person}
          </Link>
          <p className="text-muted text-sm">
            {!isMe ? (
              <Button uid={uid} type={following ? "unfollow" : "follow"} />
            ) : null}
            {timeDifference(timestamp)}
          </p>
        </div>
        <p>{comment}</p>
        {!isMe ? (
          <div className="pad-ver pb-2">
            <div className="btn-group">
              <Button active={reaction === "like"} type="like" commentId={id} />
              <Button
                active={reaction === "unlike"}
                type="unlike"
                commentId={id}
              />
            </div>
            {!isReply ? (
              <Button
                type="reply"
                onClick={() => setOpenReplyArea(!openReplyArea)}
              />
            ) : null}
          </div>
        ) : null}
        <hr />
        {replies.length ? (
          <div>
            {replies.map((reply) => (
              <Comment
                {...reply}
                isMe={currentUserUid === reply.uid}
                isReply
                following={followings.includes(reply.uid)}
                isAdmin={isAdmin}
                reaction={
                  reactions.find((reaction) => reaction.commentId === reply.id)
                    ?.reaction ?? null
                }
              />
            ))}
          </div>
        ) : null}
      </div>
      {openReplyArea ? (
        <WriteComment
          onCommentSent={() => setOpenReplyArea(false)}
          parentId={id}
        />
      ) : null}
    </div>
  );
};

Comment.defaultProps = {
  person: "",
  comment: "",
  date: "",
  isMe: false,
  following: false,
  isReply: false,
  id: 0,
  replies: [],
  followings: [],
  reactions: [],
};

Comment.propTypes = {
  id: PropTypes.number,
  person: PropTypes.string,
  comment: PropTypes.string,
  date: PropTypes.string,
  isMe: PropTypes.bool,
  following: PropTypes.bool,
  isReply: PropTypes.bool,
  replies: PropTypes.array,
  followings: PropTypes.array,
  reactions: PropTypes.array,
};

const mapStateToProps = (state) => ({
  isAdmin: state.auth.user?.isAdmin ?? false,
});

export default connect(mapStateToProps)(Comment);
