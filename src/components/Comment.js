import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import Button from "./Button";
import WriteComment from "./WriteComment";
import { onValue, ref, getDatabase } from "firebase/database";
import { Link } from "react-router-dom";
import { timeDifference, sortByDescOrder } from "../library/general-utils";
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
  topicName,
}) => {
  const [openReplyArea, setOpenReplyArea] = useState(false);

  return (
    <div className="media-block pb-2 mt-2">
      {isAdmin ? (
        <Button type="delete" topicName={topicName} commentId={id} />
      ) : null}
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
        <p className="pt-05 pb-05">{comment}</p>
        <div className="pad-ver pb-2">
          {!isMe ? (
            <div className="btn-group">
              <Button active={reaction === "like"} type="like" commentId={id} />
              <Button
                active={reaction === "unlike"}
                type="unlike"
                commentId={id}
              />
            </div>
          ) : null}
          {!isReply ? (
            <Button
              addClass={`${!isMe ? "ml-1" : ""}`}
              type="reply"
              onClick={() => setOpenReplyArea(!openReplyArea)}
            />
          ) : null}
        </div>
        <hr />
        {replies.length ? (
          <div>
            {replies.sort(sortByDescOrder).map((reply) => (
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
          topicName={topicName}
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
