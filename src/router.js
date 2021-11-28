import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { onValue, ref, getDatabase, off } from "firebase/database";
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
  makeLogout,
} from "./redux/auth/action";
import FirebaseLibrary from "./library/firebase";
import {
  handleFollowerData,
  handleReactionData,
} from "./library/general-utils";
import Logout from "./components/Logout";
import TopicComments from "./pages/TopicComments";
import { useToasts } from "react-toast-notifications";
import { blockedMsg } from "./library/constants";

const RouterPage = ({
  user,
  isAdmin,
  setFollowers,
  setReactions,
  setRestrictedWords,
  makeLogout,
}) => {
  const [blockUsers, setBlockUsers] = useState([]);
  const {
    getMyFollows,
    getMyReactions,
    getAllRestrictedWords,
    getCurrentUser,
  } = FirebaseLibrary();

  const { addToast } = useToasts();

  useEffect(() => {
    initData();
    initListeners();
  }, []);

  useEffect(() => {
    if (user) listenBlockUsers();
  }, [user]);

  useEffect(() => {
    checkAmIBlocked();
  }, [blockUsers]);

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

  const checkAmIBlocked = () => {
    if (blockUsers.includes(user?.uid)) {
      addToast(blockedMsg, { appearance: "error" });
      makeLogout();
    }
  };

  const listenBlockUsers = () => {
    off(ref(getDatabase(), "blockedUsers"), onUserBlock);
    getCurrentUser() &&
      onValue(ref(getDatabase(), "blockedUsers"), onUserBlock);
  };

  const onUserBlock = (snapshot) => {
    if (!getCurrentUser()) return;
    let blockUsersObj = snapshot?.val() ?? {};
    setBlockUsers(Object?.keys(blockUsersObj) ?? []);
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
    <div className="container bootdey">
      <div className="col-md-12 bootstrap snippets">
        {user ? <Logout /> : null}
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/comment/:commentId" element={<CommentDetail />} />
            <Route path="/comments/:topicName" element={<TopicComments />} />
            <Route
              path="/admin"
              element={isAdmin ? <Admin /> : <Navigate to="/" />}
            />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/profile/:userId" element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </div>
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
  makeLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(RouterPage);
