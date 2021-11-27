import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { onValue, ref, getDatabase } from "firebase/database";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import CommentDetail from "./pages/CommentDetail";
import { connect } from "react-redux";
import {
  makeLogin,
  setFollowers,
  setReactions,
  setRestrictedWords,
} from "./redux/auth/action";
import FirebaseLibrary from "./library/firebase";
import {
  handleFollowerData,
  handleReactionData,
} from "./library/general-utils";

const RouterPage = ({
  user,
  isAdmin,
  makeLogin,
  setFollowers,
  setReactions,
  setRestrictedWords,
}) => {
  const {
    getMyFollows,
    getMyReactions,
    getAllRestrictedWords,
  } = FirebaseLibrary();

  useEffect(() => {
    checkAuth();
    initData();
    initListeners();
  }, []);

  const initData = () => {
    initFollowList();
    initReactionList();
    initRestrictedWords();
  };

  const initListeners = () => {
    listenFollowers();
    listenReactions();
    listenRestrictedWords();
  };

  const initRestrictedWords = () => {
    getAllRestrictedWords().then((res) => {
      setRestrictedWords(res?.join(" ") ?? "");
    });
  };

  const listenRestrictedWords = () => {
    onValue(ref(getDatabase(), "restrictedWords"), (snapshot) => {
      let arr = snapshot?.val() ?? [];
      setRestrictedWords(arr?.join(" ") ?? "");
    });
  };

  const checkAuth = () => {
    const userData = localStorage?.getItem("userData") ?? null;
    if (userData) {
      makeLogin(JSON.parse(userData));
    }
  };

  const initFollowList = () => {
    getMyFollows()
      .then((follows) => setFollowers(follows))
      .catch((e) => {});
  };

  const initReactionList = () => {
    getMyReactions()
      .then(setReactions)
      .catch((e) => {});
  };

  const listenFollowers = () => {
    onValue(ref(getDatabase(), "follows"), (snapshot) => {
      const data = snapshot.val();
      setFollowers(handleFollowerData(data));
    });
  };

  const listenReactions = () => {
    onValue(ref(getDatabase(), "reactions"), (snapshot) => {
      const data = snapshot.val();
      setReactions(handleReactionData(data));
    });
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/comment/:commentId" element={<CommentDetail />} />
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/" />}
        />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/profile/:userId" element={<Profile />} />
      </Routes>
    </Router>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  isAdmin: state.auth.user?.isAdmin || false,
});

const mapDispatchToProps = {
  makeLogin,
  setFollowers,
  setReactions,
  setRestrictedWords,
};

export default connect(mapStateToProps, mapDispatchToProps)(RouterPage);
