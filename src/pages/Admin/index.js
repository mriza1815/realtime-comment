import React, { useState, useEffect } from "react";
import FirebaseLibrary from "../../library/firebase";
import { onValue, ref, getDatabase } from "firebase/database";
import { useToasts } from "react-toast-notifications";
import { successMsg } from "../../library/constants";
import { connect } from "react-redux";
import {
  Textarea,
  List,
  ListItem,
  Divider,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import LoadingContainer from "../../components/LoadingContainer";
import Avatar from "../../components/Avatar";
import { convertedArrFromObj } from "../../library/general-utils";

const Admin = ({ restrictedWords }) => {
  const {
    getAllUsers,
    handleUserList,
    saveRestrictedWords,
    blockUser,
    unBlockUser,
  } = FirebaseLibrary();

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const { addToast } = useToasts();

  useEffect(() => {
    initData();
    listenData();
  }, []);

  const initData = () => {
    initUsers();
  };

  const listenData = () => {
    listenUsers();
    listenBlocks();
  };

  const initUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((users) => {
        setLoading(false);
        setUsers(users);
      })
      .catch((err) => {
        setUsers([]);
        setLoading(false);
      });
  };

  const listenUsers = () => {
    onValue(ref(getDatabase(), "users"), (snapshot) => {
      const data = snapshot.val();
      setUsers(handleUserList(data));
    });
  };

  const listenBlocks = () => {
    onValue(ref(getDatabase(), "blockedUsers"), (snapshot) => {
      const data = snapshot.val();
      setBlockedUsers(convertedArrFromObj(data));
    });
  };

  useEffect(() => {
    setWords(restrictedWords);
  }, [restrictedWords]);

  const submit = () => {
    let arr = words
      .split(" ")
      .map((text) => text.replace(/(\r\n|\n|\r)/gm, ""));
    saveRestrictedWords(arr);
    addToast(successMsg, { appearance: "success" });
  };

  return (
    <div className="panel">
      <div className="panel-body">
        <div>
          <h2>Restricted Words</h2>
          <Textarea
            className="form-control mt-2"
            style={{ fontSize: "13px" }}
            rows={2}
            placeholder="Enter restricted words"
            defaultValue={""}
            value={words}
            onKeyUp={(e) => e.keyCode === 13 && !e.shiftKey && submit()}
            onChange={(e) => setWords(e.target.value)}
          />
          <div className="mar-top clearfix">
            <button
              className="btn btn-sm btn-primary pull-right"
              type="submit"
              onClick={submit}
            >
              <i className="fa fa-pencil fa-fw" /> Submit
            </button>
          </div>
        </div>
        <Divider mt="5" />
        <div className="mt-3">
          <h2>User List</h2>
          <LoadingContainer isLoading={loading}>
            {users.length ? (
              <List spacing={7} className="mt-2">
                {users.map((user) => {
                  const isBlocked = blockedUsers.includes(user.uid);
                  return (
                    <>
                      <ListItem key={`user-card-${user.uid}`}>
                        <div className="user-card">
                          <div className="left-content">
                            <Avatar {...user} />
                            <span>{user.displayName}</span>
                          </div>
                          <div className="user-block-switch">
                            <FormControl display="flex" alignItems="center">
                              <FormLabel
                                htmlFor="block-user-switch"
                                className="mt-0"
                              >
                                Block User
                              </FormLabel>
                              <Switch
                                isChecked={isBlocked}
                                id="block-user-switch"
                                onChange={() =>
                                  isBlocked
                                    ? unBlockUser(user.uid)
                                    : blockUser(user.uid)
                                }
                              />
                            </FormControl>
                          </div>
                        </div>
                      </ListItem>
                      <Divider orientation="horizontal" />
                    </>
                  );
                })}
              </List>
            ) : (
              <span></span>
            )}
          </LoadingContainer>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  restrictedWords: state.auth.restrictedWords,
});

export default connect(mapStateToProps)(Admin);
