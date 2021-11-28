import React, { useEffect, useState } from "react";
import Comment from "../../components/Comment";
import LoadingContainer from "../../components/LoadingContainer";
import { onValue, ref, getDatabase } from "firebase/database";
import FirebaseLibrary from "../../library/firebase";
import { useParams } from "react-router-dom";
import { handleAllCommentData } from "../../library/general-utils";
import { connect } from "react-redux";

const CommentDetail = ({ user, followings, reactions }) => {
  let { commentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState(null);
  const [replies, setReplies] = useState([]);
  const { getAllComments } = FirebaseLibrary();

  useEffect(() => {
    getCommentData();
    listenReplies();
  }, [commentId]);

  const getCommentData = () => {
    setLoading(true);
    getAllComments()
      .then((comments) => {
        setLoading(false);
        setComment(comments.find((c) => c.id == commentId));
      })
      .catch((e) => {
        setLoading(false);
        setComment([]);
      });
  };

  const listenReplies = () => {
    onValue(ref(getDatabase(), "comments"), (snapshot) => {
      const data = snapshot.val();
      const arr = handleAllCommentData(data);
      setReplies(arr.filter((reply) => reply.parent == commentId));
    });
  };

  return (
    <div className="panel">
      <div className="panel-body">
        <LoadingContainer isLoading={loading}>
          {comment ? (
            <Comment
              {...comment}
              isMe={user?.uid === comment?.uid}
              reactions={reactions}
              followings={followings}
              currentUserUid={user?.uid}
              following={followings.includes(comment.uid)}
              replies={replies}
              reaction={
                reactions.find((reaction) => reaction.commentId === comment.id)
                  ?.reaction ?? null
              }
            />
          ) : null}
        </LoadingContainer>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  followings: state.auth.followings,
  reactions: state.auth.reactions,
});

export default connect(mapStateToProps)(CommentDetail);
