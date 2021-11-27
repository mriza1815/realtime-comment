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
} from "firebase/auth";
import { getDatabase, ref, set, get, child, remove } from "firebase/database";
import { firebaseConfig } from "../firebase.config";
import {
  convertedArrFromObj,
  getRandom,
  handleFollowerData,
  handleReactionData,
  findLocalIp,
} from "./general-utils";
import { getCurrentUser } from "./redux-utils";
let googlePr;
let facebookPr;
let database;
var commentListener;
var firebaseApp;

const FirebaseLibrary = () => {
  useEffect(() => {
    initFirebase();
  }, []);

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

  const getAllComments = () => {
    const dbRef = ref(getDatabase());
    return new Promise((resolve, reject) => {
      get(child(dbRef, `comments`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const commentsObj = snapshot.val();
            resolve(convertedArrFromObj(commentsObj));
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

  const deleteComment = (id) => {
    const db = getDatabase();
    remove(ref(db, `comments/${id}`));
  };

  const addComment = (comment) => {
    const db = getDatabase();
    set(ref(db, `comments/${comment.id}`), {
      ...comment,
    });
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

  const makeEmailLogin = (isLogin, name, email, password) => {
    return new Promise((resolve, reject) => {
      if (isLogin) {
        signInWithEmailAndPassword(email, password)
          .then((res) => resolve(res.user))
          .catch(reject);
      } else {
        createUserWithEmailAndPassword(email, password)
          .then((res) => {
            onAuthStateChanged((user) => {
              user
                .updateProfile({ displayName: name })
                .then(() => resolve(user));
            });
          })
          .catch(reject);
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
  };
};

FirebaseLibrary.propTypes = {};

export default FirebaseLibrary;
