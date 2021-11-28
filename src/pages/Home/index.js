import React, { useEffect, useState } from "react";
import Comment from "../../components/Comment";
import WriteComment from "../../components/WriteComment";
import LoadingContainer from "../../components/LoadingContainer";
import FirebaseLibrary from "../../library/firebase";
import { onValue, ref, getDatabase } from "firebase/database";
import Login from "../../components/Login";
import { makeLogin, makeLogout } from "../../redux/auth/action";
import {
  registerSuccessMsg,
  loginSuccessMsg,
  loginErrorMsg,
  prepareUserData,
  prepareUserDataWithEmail,
  emptyCommentList,
} from "../../library/constants";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import FormModal from "../../components/Modal";
import { convertedArrFromObj } from "../../library/general-utils";

const Home = ({ user, makeLogin, makeLogout, followings, reactions }) => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [type, setType] = useState("all");
  const { addToast } = useToasts();

  const {
    googlePr,
    facebookPr,
    makeEmailLogin,
    makeSocialLogin,
    getAllComments,
    saveUser,
  } = FirebaseLibrary();

  useEffect(() => {
    initCommentList();
    listenComments();
  }, []);

  const listenComments = () => {
    onValue(ref(getDatabase(), "comments"), (snapshot) => {
      const data = snapshot.val();
      setComments(convertedArrFromObj(data));
    });
  };

  const initCommentList = () => {
    setLoading(true);
    getAllComments()
      .then((comments) => {
        setLoading(false);
        console.log("comments", comments);
        setComments(comments);
      })
      .catch((e) => {
        setLoading(false);
        setComments([]);
      });
  };

  const emailAuth = (alreadyMember, name, email, password) => {
    setModal(false);
    makeEmailLogin(alreadyMember, email, password)
      .then((res) => {
        const mapUserData = prepareUserDataWithEmail(res, name);
        makeLogin(mapUserData);
        saveUser(mapUserData);
        localStorage.setItem("userData", JSON.stringify(mapUserData));
        addToast(alreadyMember ? loginSuccessMsg : registerSuccessMsg, {
          appearance: "success",
        });
      })
      .catch((e) => {
        console.log("catch", e.message);
        addToast(e.message || loginErrorMsg, { appearance: "error" });
      });
  };

  const socialAuth = (provider) => {
    makeSocialLogin(provider)
      .then((result) => {
        const mapUserData = prepareUserData(result);
        makeLogin(mapUserData);
        saveUser(mapUserData);
        localStorage.setItem("userData", JSON.stringify(mapUserData));
        addToast(loginSuccessMsg, { appearance: "success" });
      })
      .catch((e) => {
        console.log("socialAuth error", e);
        addToast(e.code || e.message || loginErrorMsg, { appearance: "error" });
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
      <FormModal
        show={modal}
        onSave={emailAuth}
        handleClose={() => setModal(false)}
      />
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
                className={`nav-link ${
                  type === "onlyFollowing" ? "active" : ""
                }`}
                onClick={() => setType("onlyFollowing")}
              >
                Only Following
              </a>
            </li>
          </ul>
        ) : null}
        {!user ? (
          <Login
            googleLogin={() => socialAuth(googlePr)}
            userData={{}}
            facebookLogin={() => socialAuth(facebookPr)}
            emailLogin={() => setModal(true)}
          />
        ) : null}
        <WriteComment />
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
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  followings: state.auth.followings,
  reactions: state.auth.reactions,
});

const mapDispatchToProps = {
  makeLogin,
  makeLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
