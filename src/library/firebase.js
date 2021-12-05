import { useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set, get, child, remove } from "firebase/database";
import { firebaseConfig } from "../firebase.config";
import {
  convertedArrFromObj,
  handleFollowerData,
  handleReactionData,
  findLocalIp,
  handleAllCommentData,
} from "./general-utils";
import { generateRandomAvatarId } from "./constants";
let googlePr;
let facebookPr;
let database;
var commentListener;
var firebaseApp;

const FirebaseLibrary = () => {
  const initFirebase = () => {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
      database = getDatabase();
      googlePr = new GoogleAuthProvider();
      googlePr.addScope("https://www.googleapis.com/auth/contacts.readonly");
      commentListener = ref(database, "comments");
      facebookPr = new FacebookAuthProvider();
      facebookPr.addScope("user_birthday");
    }
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      } else {
      }
    });
  };

  const getCurrentUser = () => {
    const auth = getAuth();
    return auth.currentUser;
  };

  const getAllUsers = () => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `users`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const usersObj = snapshot.val();
            resolve(handleUserList(usersObj));
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleUserList = (usersObj) => {
    const currentUser = getCurrentUser();
    return convertedArrFromObj(usersObj).filter(
      (user) => user?.uid !== currentUser.uid
    );
  };

  const saveUser = async (userData) => {
    const db = getDatabase();
    const ip = await findLocalIp();
    set(ref(db, `users/${userData.uid}`), {
      ...userData,
      ip,
    });
  };

  const getUserProfile = (id) => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `users/${id}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getUserFollowerCount = (id) => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `follows`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const followObj = snapshot.val();
            const arr = convertedArrFromObj(followObj);
            console.log("followObj", arr);
            resolve(arr.filter((a) => a.followingId === id).length);
          } else {
            reject(0);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const checkUserIsBlock = (uid) => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `blockedUsers`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const blockedUsers = snapshot.val();
            Object.keys(blockedUsers).includes(uid) ? reject() : resolve();
          } else {
            resolve();
          }
        })
        .catch((error) => {
          resolve();
        });
    });
  };

  const getAllComments = (topicName = "") => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `comments/${topicName}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const commentsObj = snapshot.val();
            resolve(
              !topicName
                ? handleAllCommentData(commentsObj)
                : convertedArrFromObj(commentsObj)
            );
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getMyFollows = () => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `follows`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const followObj = snapshot.val();
            resolve(handleFollowerData(followObj));
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getMyReactions = () => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `reactions`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const commentsObj = snapshot.val();
            resolve(handleReactionData(commentsObj));
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getUserComment = (uid) => {
    return new Promise((resolve, reject) => {
      getAllComments()
        .then((comments) => {
          resolve(
            comments.filter((comment) => !comment.parent && comment.uid === uid)
          );
        })
        .catch(() => reject());
    });
  };

  const deleteComment = (topicName, id) => {
    const db = getDatabase();
    remove(ref(db, `comments/${topicName}/${id}`));
  };

  const addComment = (comment, topicName) => {
    const db = getDatabase();
    set(ref(db, `comments/${topicName}/${comment.id}`), {
      ...comment,
      topicName,
    });
  };

  const blockUser = (uid) => {
    const db = getDatabase();
    set(ref(db, `blockedUsers/${uid}`), uid);
  };

  const unBlockUser = (uid) => {
    const db = getDatabase();
    remove(ref(db, `blockedUsers/${uid}`));
  };

  const followUser = (uid) => {
    const db = getDatabase();
    const user = getCurrentUser();
    set(ref(db, `follows/${user.uid}-${uid}`), {
      followerId: user.uid,
      followingId: uid,
    });
  };

  const unfollowUser = (uid) => {
    const db = getDatabase();
    const user = getCurrentUser();
    remove(ref(db, `follows/${user.uid}-${uid}`), {
      followerId: user.uid,
      followingId: uid,
    });
  };

  const addReaction = (commentId, reaction) => {
    const db = getDatabase();
    const user = getCurrentUser();
    set(ref(db, `reactions/${user.uid}-${commentId}`), {
      commentId: commentId,
      userId: user.uid,
      reaction,
    });
  };

  const deleteReaction = (commentId) => {
    const db = getDatabase();
    const user = getCurrentUser();
    remove(ref(db, `reactions/${user.uid}-${commentId}`));
  };

  const makeEmailLogin = (alreadyMember, email, password, displayName) => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      if (alreadyMember) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => resolve(userCredential.user))
          .catch(reject);
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            const currentUser = auth?.currentUser;
            const avatarId = generateRandomAvatarId();
            if (currentUser) {
              updateProfile(auth.currentUser, {
                displayName,
                photoURL: `https://bootdey.com/img/Content/avatar/avatar${avatarId}.png`,
              });
            }
            resolve({ ...user, avatarId });
          })
          .catch((err) => {
            reject(err);
            console.log("err", err);
          });
      }
    });
  };

  const makeSocialLogin = (provider) => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      signInWithPopup(auth, provider).then(resolve).catch(reject);
    });
  };

  const getAllRestrictedWords = () => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `restrictedWords`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const saveRestrictedWords = (wordList) => {
    const db = getDatabase();
    set(ref(db, `restrictedWords`), {
      ...wordList,
    });
  };

  return {
    initFirebase,
    googlePr,
    facebookPr,
    makeEmailLogin,
    makeSocialLogin,
    addComment,
    commentListener,
    getUserProfile,
    getUserComment,
    deleteComment,
    getAllComments,
    followUser,
    unfollowUser,
    getMyFollows,
    addReaction,
    deleteReaction,
    getMyReactions,
    saveUser,
    saveRestrictedWords,
    getAllRestrictedWords,
    getUserFollowerCount,
    getAllUsers,
    handleUserList,
    blockUser,
    unBlockUser,
    getCurrentUser,
    checkUserIsBlock,
  };
};

FirebaseLibrary.propTypes = {};

export default FirebaseLibrary;
