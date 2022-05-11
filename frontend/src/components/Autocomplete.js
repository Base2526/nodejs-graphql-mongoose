import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, Fragment, useRef } from "react";
import { connect } from "react-redux";

import { useVoice } from "./useVoice";
import Mic from "../images/microphone-black-shape.svg";

import { addHistory, deleteHistory } from "../actions/user";
import { SEARCH_RESET } from "../constants";

const Autocomplete = (props) => {
  const [typeSearch, setTypeSearch] = useState("text");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

  const [clickedOutside, setClickedOutside] = useState(false);
  const inputRef = useRef();
  const ulRef = useRef();

  // const [textVice, setTextVice] = useState("");
  const { text, isListening, listen, voiceSupported } = useVoice();

  var _ = require("lodash");

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    if (isListening) {
      setTypeSearch("voice");
    } else {
      if (_.isEqual(typeSearch, "voice")) {
        if (text) {
          console.log("search voice #1>>", typeSearch, text);

          setUserInput(text);

          search(text);
        } else {
          console.log("search voice #2>>", typeSearch, text);
        }
      }
    }
  }, [isListening]);

  const search = (text) => {
    props.onSearch(text);
    console.log("search userInput : ", text);
  };

  const handleClickInside = () => setClickedOutside(false);
  const handleClickOutside = (e) => {
    // console.log(inputRef, ulRef);
    if (_.isEmpty(inputRef.current) || _.isEmpty(ulRef.current)) {
      return;
    }

    if (
      !inputRef.current.contains(e.target) &&
      !ulRef.current.contains(e.target)
    ) {
      setClickedOutside(true);

      if (showSuggestions) {
        setShowSuggestions(false);
      }
    }
  };

  const onChange = (e) => {
    setTypeSearch("text");
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = props.suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setActiveSuggestion(0);
    setFilteredSuggestions(filteredSuggestions);
    setShowSuggestions(true);
    setUserInput(e.currentTarget.value);
  };

  const onKeyDown = (e) => {
    console.log("e.keyCode : ", e.keyCode);
    setTypeSearch("text");

    // User pressed the enter key
    if (e.keyCode === 13) {
      if (activeSuggestion) {
        console.log(">>", userInput, activeSuggestion);

        setActiveSuggestion(0);
        setShowSuggestions(false);
        setUserInput(filteredSuggestions[activeSuggestion]);

        search(userInput);
      } else if (!_.isEmpty(userInput)) {
        setActiveSuggestion(0);
        setShowSuggestions(false);
        setUserInput(userInput);

        search(userInput);
      } else {
        // reset
        setShowSuggestions(false);
        search(SEARCH_RESET);
      }
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  const onClick = (e) => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);

    search(e.currentTarget.innerText);
  };

  const suggestionsListComponent = () => {
    if (showSuggestions) {
      if (filteredSuggestions.length) {
        return (
          <ul className="suggestions" ref={ulRef}>
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <div key={suggestion} className="wrap-search">
                  <li className={className} key={suggestion} onClick={onClick}>
                    {suggestion}
                  </li>
                  <button
                    className="btn-remove"
                    onClick={() => {
                      const filteredSuggestions = props.suggestions.filter(
                        (o) => {
                          return !o.includes(suggestion);
                        }
                      );

                      // console.log("suggestion :", suggestion);

                      setActiveSuggestion(0);
                      setFilteredSuggestions(filteredSuggestions);
                      setShowSuggestions(true);

                      props.onDeleteHistory(suggestion);
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </ul>
        );
      } else {
        // return (
        //   <div className="no-suggestions">
        //     <em>No suggestions, you're on your own!</em>
        //   </div>
        // );
        return <div />;
      }
    }
  };

  const voiceView = () => {
    return (
      <div className="col-auto pl-1">
        <div className="use-microphone d-flex">
          <img
            className={`microphone ${isListening && "isListening"}`}
            src={Mic}
            alt="microphone"
            onClick={listen}
          />
        </div>
        {/* <div>
          <p>{textVice}</p>
          <div>
            {textVice !== "" ? (
              <button onClick={() => setTextVice("")}>Clear</button>
            ) : (
              ""
            )}
          </div>
        </div> */}
      </div>
    );
  };

  const clearView = () => {
    if (_.isEqual(typeSearch, "voice") && userInput) {
      return (
        <button
          type="button"
          className="close-x"
          onClick={() => {
            setActiveSuggestion(0);
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            setUserInput("");
          }}
        >
          X
        </button>
      );
    }

    if (_.isEqual(typeSearch, "text") && userInput) {
      return (
        <button
          type="button"
          className="close-x"
          onClick={() => {
            setActiveSuggestion(0);
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            setUserInput("");
          }}
        >
          X
        </button>
      );
    }
    // showSuggestions && (
    //   <button
    //     type="button"
    //     onClick={() => {
    //       setActiveSuggestion(0);
    //       setFilteredSuggestions([]);
    //       setShowSuggestions(false);
    //       setUserInput("");
    //     }}
    //   >
    //     X
    //   </button>
    // )
  };

  return (
    <div className="row mt-2 mb-3 position-relative advanced-search">
      <Fragment>
        {/* <div>Icon search</div> */}
        <label className="col-12 text-dark font-weight-bold">
          Input keyword
        </label>
        <div className="col position-relative">
          <div className="d-flex position-relative contain-search px-2 py-2 font-prompt">
            <FontAwesomeIcon icon={faSearch} />
            <input
              ref={inputRef}
              type="text"
              placeholder={props.placeholder}
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={userInput}
              className="form-control"
              onFocus={(e) => {
                // setActiveSuggestion(0);
                setFilteredSuggestions(props.suggestions);
                setShowSuggestions(true);
                // setUserInput("");
              }}
              onBlur={(e) => {}}
            />
            {/* <button type="button" className="btn bg-primary text-white">
              Search
            </button> */}
          </div>

          {clearView()}
        </div>

        {suggestionsListComponent()}
      </Fragment>

      {voiceSupported && voiceView()}
    </div>
  );
};

// export default Autocomplete;
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    historys: state.user.historys,
  };
};

const mapDispatchToProps = {
  addHistory,
  deleteHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Autocomplete);
