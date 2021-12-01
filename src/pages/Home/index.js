import React, { useEffect, useState } from "react";
import Comment from "../../components/Comment";
import LoadingContainer from "../../components/LoadingContainer";
import FirebaseLibrary from "../../library/firebase";
import { onValue, ref, getDatabase } from "firebase/database";
import { emptyCommentList } from "../../library/constants";
import { connect } from "react-redux";
import { handleAllCommentData } from "../../library/general-utils";

const Home = ({ user, followings, reactions }) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [type, setType] = useState("all");

  const { getAllComments } = FirebaseLibrary();

  useEffect(() => {
    initCommentList();
    listenComments();
  }, []);

  const listenComments = () => {
    onValue(ref(getDatabase(), "comments"), (snapshot) => {
      const data = snapshot.val();
      setComments(handleAllCommentData(data));
    });
  };

  const initCommentList = () => {
    setLoading(true);
    getAllComments()
      .then((comments) => {
        setLoading(false);
        setComments(comments);
      })
      .catch((e) => {
        setLoading(false);
        setComments([]);
      });
  };

  const getListedCommentList = () => {
    let commentList = comments.filter((comment) => !comment.parent);
    if (type === "onlyFollowing")
      commentList = commentList.filter(
        (comment) =>
          comment.uid === user?.uid || followings.includes(comment.uid)
      );
    return commentList;
  };

  const commentList = getListedCommentList();

  return (
    <>
      {user ? (
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className={`nav-link ${type === "all" ? "active" : ""}`}
              aria-current="page"
              onClick={() => setType("all")}
            >
              All Comments
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${type === "onlyFollowing" ? "active" : ""}`}
              onClick={() => setType("onlyFollowing")}
            >
              Only Following
            </a>
          </li>
        </ul>
      ) : null}
      <div className="panel">
        <div className="panel-body">
          <LoadingContainer isLoading={loading}>
            {commentList.length ? (
              commentList.map((comment) => (
                <Comment
                  key={`comment-${comment.id}`}
                  {...comment}
                  isMe={user?.uid === comment.uid}
                  reactions={reactions}
                  followings={followings}
                  currentUserUid={user?.uid}
                  following={followings.includes(comment.uid)}
                  replies={comments.filter(
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

export default connect(mapStateToProps)(Home);
