import React, { useEffect, useState } from "react";
import Comment from "../../components/Comment";
import LoadingContainer from "../../components/LoadingContainer";
import { onValue, ref, getDatabase } from "firebase/database";
import FirebaseLibrary from "../../library/firebase";
import { useParams } from "react-router-dom";
import { convertedArrFromObj } from "../../library/general-utils";
import { connect } from "react-redux";
import WriteComment from "../../components/WriteComment";
import { emptyCommentList } from "../../library/constants";

const TopicComments = ({ user, followings, reactions }) => {
  let { topicName } = useParams();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const { getAllComments } = FirebaseLibrary();

  useEffect(() => {
    getCommentData();
    listenReplies();
  }, [topicName]);

  const getCommentData = () => {
    setLoading(true);
    getAllComments(topicName)
      .then((comments) => {
        setLoading(false);
        setComments(comments.filter((reply) => !reply.parent));
        setReplies(comments.filter((reply) => reply.parent));
      })
      .catch((e) => {
        setLoading(false);
        setComments([]);
        setReplies([]);
      });
  };

  const listenReplies = () => {
    onValue(ref(getDatabase(), `comments/${topicName}`), (snapshot) => {
      const data = snapshot.val();
      const arr = convertedArrFromObj(data);
      setComments(arr.filter((reply) => !reply.parent));
      setReplies(arr.filter((reply) => reply.parent));
    });
  };

  return (
    <>
      <WriteComment topicName={topicName} />
      <div className="panel">
        <div className="panel-body">
          <LoadingContainer isLoading={loading}>
            {comments.length ? (
              comments.map((comment) => (
                <Comment
                  key={`comment-${comment.id}`}
                  {...comment}
                  isMe={user?.uid === comment.uid}
                  reactions={reactions}
                  followings={followings}
                  currentUserUid={user?.uid}
                  following={followings.includes(comment.uid)}
                  replies={replies.filter(
                    (reply) => reply.parent === comment.id
                  )}
                  reaction={
                    reactions.find(
                      (reaction) => reaction.commentId === comment.id
                    )?.reaction ?? null
                  }
                />
              ))
            ) : (
              <span className="text-info mt-4">{emptyCommentList}</span>
            )}
          </LoadingContainer>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  followings: state.auth.followings,
  reactions: state.auth.reactions,
});

export default connect(mapStateToProps)(TopicComments);
