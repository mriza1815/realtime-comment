import React, { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import Comment from "../../components/Comment";
import { useParams } from "react-router-dom";
import { onValue, ref, getDatabase } from "firebase/database";
import FirebaseLibrary from "../../library/firebase";
import { emptyCommentList } from "../../library/constants";
import { connect } from "react-redux";
import { convertedArrFromObj } from "../../library/general-utils";

const Profile = ({ user, followings, reactions }) => {
  let { userId } = useParams();
  const [comments, setComments] = useState([]);
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
      let arr = convertedArrFromObj(commentObj);
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
    getUserComment(userId)
      .then(setComments)
      .catch(() => setComments([]));
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
    <div className="container bootdey">
      <div className="col-md-12 bootstrap snippets">
        <ProfileCard
          profileInfo={profileInfo}
          followerCount={followerCount}
          selectedUserId={userId}
          following={followings.includes(userId)}
        />
        <div className="panel">
          <div className="panel-body">
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
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  followings: state.auth.followings,
  reactions: state.auth.reactions,
});

export default connect(mapStateToProps)(Profile);
