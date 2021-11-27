import React from "react";
import { connect } from "react-redux";
import Button from "./Button";

const ProfileCard = ({
  profileInfo,
  selectedUserId,
  user,
  followerCount,
  meFollowerCount,
  following,
}) => {
  const isMe = user?.uid === selectedUserId;
  return (
    <div className="panel">
      <div className="panel-body">
        <div className="media-block">
          <a className="media-left" href="#">
            <img
              className="img-circle img-sm"
              alt="Profile Picture"
              src={`https://bootdey.com/img/Content/avatar/avatar${
                isMe ? user.avatarId : "1"
              }.png`}
            />
          </a>
          <div className="media-body">
            <div className="mar-btm">
              <a
                href="#"
                className="btn-link text-semibold media-heading box-inline"
              >
                {profileInfo?.displayName ?? ""}
              </a>
              <p className="text-muted text-sm">
                {!isMe ? (
                  <Button
                    uid={selectedUserId}
                    type={following ? "unfollow" : "follow"}
                  />
                ) : null}
                {`${isMe ? meFollowerCount : followerCount || 0} followers`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  meFollowerCount: state.auth.followerCount,
});

export default connect(mapStateToProps)(ProfileCard);
