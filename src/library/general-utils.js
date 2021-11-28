import moment from "moment";
import { getCurrentUser } from "./redux-utils";

export const convertedArrFromObj = (commentsObj) => {
  if (!commentsObj) return [];
  const arr = [];
  Object.keys(commentsObj).forEach((key) => arr.push(commentsObj[key]));
  return arr.sort(sortByOrder);
};

export const handleFollowerData = (followerObj) => {
  if (!followerObj) return { followings: [], followerCount: 0 };
  const user = getCurrentUser();
  const arr = [];
  Object.keys(followerObj).forEach((key) => arr.push(followerObj[key]));
  const followings = arr
    .filter((follow) => follow.followerId === user?.uid)
    .map((follow) => follow.followingId);

  const followerCount = arr.filter((follow) => follow.followingId === user?.uid)
    .length;
  return { followings, followerCount };
};

export const handleReactionData = (reactionObj) => {
  if (!reactionObj) return [];
  const user = getCurrentUser();
  const arr = [];
  Object.keys(reactionObj).forEach((key) => arr.push(reactionObj[key]));
  const myReactions = arr.filter((reaction) => reaction.userId === user?.uid);

  return myReactions;
};

export const timeDifference = (timestamp) => {
  return moment(timestamp).fromNow();
};

export const findLocalIp = (logInfo = false) =>
  new Promise((resolve, reject) => {
    window.RTCPeerConnection =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;

    if (typeof window.RTCPeerConnection == "undefined")
      return reject("WebRTC not supported by browser");

    let pc = new RTCPeerConnection();
    let ips = [];

    pc.createDataChannel("");
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((err) => reject(err));
    pc.onicecandidate = (event) => {
      if (!event || !event.candidate) {
        // All ICE candidates have been sent.
        if (ips.length == 0)
          return reject("WebRTC disabled or restricted by browser");

        return resolve((ips && ips.ip) || (ips && ips[0]) || null);
      }

      let parts = event.candidate.candidate.split(" ");
      let [
        base,
        componentId,
        protocol,
        priority,
        ip,
        port,
        ,
        type,
        ...attr
      ] = parts;
      let component = ["rtp", "rtpc"];

      if (!ips.some((e) => e == ip)) ips.push(ip);

      if (!logInfo) return resolve((ips && ips[0]) || null);
      else resolve((ips && ips[0]) || null);
    };
    setTimeout(() => {
      pc.close();
    }, 500);
  });

export const getRandom = () => {
  return (Math.random() + 1).toString(36).substring(7);
};

const sortByOrder = (x, y) => y.timestamp - x.timestamp;
export const sortByDescOrder = (x, y) => x.timestamp - y.timestamp;
