import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import FirebaseLibrary from "../library/firebase";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  authInfoMsg,
  emptyCommentMsg,
  commentSuccessMsg,
  attachImgEnabled,
  restrictedWordWarning,
} from "../library/constants";
import ImageModal from "./ImageModal";

const WriteComment = ({
  isReply,
  user,
  parentId,
  onCommentSent,
  restrictedWords,
  topicName,
}) => {
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const { addComment } = FirebaseLibrary();
  const { addToast } = useToasts();
  const modalRef = useRef();

  const checkLogin = () => {
    return new Promise((resolve, reject) => {
      (user && resolve()) || reject(authInfoMsg);
    });
  };

  const checkCommentText = () => {
    return new Promise((resolve, reject) => {
      (comment.trim() && resolve()) || reject(emptyCommentMsg);
    });
  };

  const checkRestrictedWords = () => {
    return new Promise((resolve, reject) => {
      if (!comment || !restrictedWords) resolve();
      let restrictedArr = restrictedWords.split(",");
      let restrictedWordExist = comment.split(/[\s,]+/).some((text) => {
        return restrictedArr.includes(text.replace(/(\r\n|\n|\r)/gm, ""));
      });
      (!restrictedWordExist && resolve()) || reject(restrictedWordWarning);
    });
  };

  const submitComment = () => {
    checkLogin()
      .then(checkRestrictedWords)
      .then(checkCommentText)
      .then(() => {
        setComment("");
        const commentData = {
          id: new Date().valueOf(),
          person: user.displayName,
          uid: user.uid,
          comment: comment,
          parent: parentId,
          timestamp: +new Date(),
          avatarId: user?.avatarId ?? 1,
          avatar: user?.avatar ?? null,
          imageUrl: imageUrl,
        };
        addComment(commentData, topicName);
        addToast(commentSuccessMsg, { appearance: "success" });
        onCommentSent();
      })
      .catch((msg) => {
        addToast(msg, { appearance: "error" });
      });
  };

  return (
    <>
      <ImageModal
        ref={modalRef}
        show={showImageModal}
        onSave={(img) => {
          setImageUrl(img);
          setShowImageModal(false);
        }}
        handleClose={() => setShowImageModal(false)}
      />
      <div className={`panel ${isReply ? "comment-reply-input" : ""}`}>
        <div className="panel-body">
          <textarea
            className="form-control"
            rows={2}
            placeholder="What are you thinking?"
            defaultValue={""}
            value={comment}
            disabled={!user}
            onKeyUp={(e) => e.keyCode === 13 && !e.shiftKey && submitComment()}
            onChange={(e) => setComment(e.target.value)}
          />
          {imageUrl ? (
            <div className="thumb-container">
              <a
                onClick={() => {
                  setImageUrl(null);
                  modalRef.current.clearImageUrl();
                }}
              >
                <i className="fa fa-times fa-fw" />
              </a>
              <img
                src={imageUrl}
                onError={() => {
                  setImageUrl(null);
                  modalRef.current.clearImageUrl();
                }}
              />
            </div>
          ) : null}
          <div className="mar-top clearfix">
            <button
              className="btn btn-sm btn-primary pull-right"
              type="submit"
              onClick={submitComment}
            >
              <i className="fa fa-pencil fa-fw" /> Share
            </button>
            {attachImgEnabled && user ? (
              <a
                className="btn btn-trans btn-icon fa fa-camera add-tooltip"
                onClick={() => setShowImageModal(true)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  restrictedWords: state.auth.restrictedWords,
});

WriteComment.defaultProps = {
  isReply: false,
  topicName: false,
  parentId: 0,
  onCommentSent: () => null,
};

WriteComment.propTypes = {
  isReply: PropTypes.bool,
  parentId: PropTypes.number,
  onCommentSent: PropTypes.func,
  topicName: PropTypes.string,
};

export default connect(mapStateToProps)(WriteComment);
