import React, { useState, useEffect } from "react";
import FirebaseLibrary from "../../library/firebase";
import { useToasts } from "react-toast-notifications";
import { successMsg } from "../../library/constants";
import { connect } from "react-redux";

const Admin = ({ restrictedWords }) => {
  const { saveRestrictedWords } = FirebaseLibrary();

  const [words, setWords] = useState([]);
  const { addToast } = useToasts();

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
        <h2>Restricted Words</h2>
        <textarea
          className="form-control"
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  restrictedWords: state.auth.restrictedWords,
});

export default connect(mapStateToProps)(Admin);
