import React, { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import Comment from "../../components/Comment";
import { useParams } from "react-router-dom";
import { onValue, ref, getDatabase } from "firebase/database";
import FirebaseLibrary from "../../library/firebase";
import { emptyCommentList } from "../../library/constants";
import { connect } from "react-redux";
import {
  convertedArrFromObj,
  handleAllCommentData,
} from "../../library/general-utils";
import LoadingContainer from "../../components/LoadingContainer";

const Profile = ({ user, followings, reactions }) => {
  let { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);

  const {
    getUserComment,
    getUserProfile,
    getUserFollowerCount,
  } = FirebaseLibrary();

  useEffect(() => {
    initData();
    listenData();
  }, []);

  const initData = () => {
    setUserComments();
    setUserProfile();
    setFollowerInfo();
  };

  const listenData = () => {
    listenUserComments();
    listenFollowerInfo();
  };

  const listenUserComments = () => {
    onValue(ref(getDatabase(), "comments"), (snapshot) => {
      let commentObj = snapshot?.val() ?? [];
      let arr = handleAllCommentData(commentObj);
      setComments(
        arr.filter((comment) => !comment.parent && comment.uid === userId)
      );
    });
  };

  const listenFollowerInfo = () => {
    onValue(ref(getDatabase(), "follows"), (snapshot) => {
      let followObj = snapshot?.val() ?? [];
      let arr = convertedArrFromObj(followObj);
      setFollowerCount(
        arr.filter((follow) => follow.followingId === userId).length
      );
    });
  };

  const setUserComments = () => {
    setLoading(true);
    getUserComment(userId)
      .then((data) => {
        setLoading(false);
        setComments(data);
      })
      .catch(() => {
        setComments([]);
        setLoading(false);
      });
  };

  const setUserProfile = () => {
    getUserProfile(userId)
      .then(setProfileInfo)
      .catch(() => setProfileInfo(null));
  };

  const setFollowerInfo = () => {
    getUserFollowerCount(userId)
      .then(setFollowerCount)
      .catch(() => setProfileInfo(null));
  };

  return (
    <>
      <ProfileCard
        profileInfo={profileInfo}
        followerCount={followerCount}
        selectedUserId={userId}
        following={followings.includes(userId)}
      />
      <div className="panel">
        <div className="panel-body">
          <LoadingContainer isLoading={loading}>
            {comments.length ? (
              comments.map((comment) => (
                <Comment
                  {...comment}
                  isMe={user?.uid === comment.uid}
                  reactions={reactions}
                  following={followings.includes(comment.uid)}
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

export default connect(mapStateToProps)(Profile);
