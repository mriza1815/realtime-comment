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
  const data = isMe ? user : profileInfo;
  const avatarPic =
    data?.avatar ??
    `https://bootdey.com/img/Content/avatar/avatar${data?.avatarId}.png`;
  return (
    <div className="panel">
      <div className="panel-body">
        <div className="media-block">
          <a className="media-left">
            <img
              className="img-circle img-sm"
              style={{
                visibility:
                  data?.avatarId || data?.avatar ? "visible" : "hidden",
              }}
              alt={data?.displayName}
              src={avatarPic}
            />
          </a>
          <div className="media-body">
            <div className="mar-btm">
              <a className="btn-link text-semibold media-heading box-inline">
                {data?.displayName ?? ""}
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
