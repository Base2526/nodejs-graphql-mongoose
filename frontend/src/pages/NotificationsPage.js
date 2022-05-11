import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretSquareUp,
  faEllipsisV,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";

import history from "../history";

var _ = require("lodash");

const NotificationsPage = (props) => {
  const history = useHistory();

  useEffect(() => {
    if (_.isEmpty(props.user)) {
      history.push({ pathname: `/`, state: {} });
      return;
    }

    let { item } = props.location.state;
    let { id } = props.match.params;
    console.log("DetailPage useEffect : props > ", props, item);
  }, []);

  const handleClick = () => {
    history.push("/");
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="mt-2 mt-md-4"></div>
        <div className="mb-3">
          <div className="d-flex ">
            <div className="bx-icon">
              <a href="#" className="icon-users">
                <figure>
                  <FontAwesomeIcon icon={faUserAlt} />
                </figure>
              </a>
            </div>

            <div className="flex-grow-1 py-1 pl-md-2">
              <div className="d-inline-block text-dark title-head">
                <p className="h5 mb-1">
                  40 items just added to your buy and sale group
                </p>
              </div>
              <p className="tex-d-follow color-gray80 mb-1">11 hours ago</p>
            </div>
          </div>
          <hr className="my-2" />
        </div>{" "}
        {/* column */}
        <div className="mb-3">
          <div className="d-flex ">
            <div className="bx-icon">
              <a href="#" className="icon-users">
                <figure>
                  <FontAwesomeIcon icon={faUserAlt} />
                </figure>
              </a>
            </div>

            <div className="flex-grow-1 py-1 pl-md-2">
              <div className="d-inline-block text-dark title-head">
                <p className="h5  mb-1">
                  40 items just added to your buy and sale group
                </p>
              </div>
              <p className="tex-d-follow color-gray80 mb-1">11 hours ago</p>
            </div>
          </div>
          <hr className="my-2" />
        </div>{" "}
        {/* column */}
        <div className="mb-3">
          <div className="d-flex ">
            <div className="bx-icon">
              <a href="#" className="icon-users">
                <figure>
                  <FontAwesomeIcon icon={faUserAlt} />
                </figure>
              </a>
            </div>

            <div className="flex-grow-1 py-1 pl-md-2">
              <div className="d-inline-block text-dark title-head">
                <p className="h5 mb-1">
                  40 items just added to your buy and sale group
                </p>
              </div>
              <p className="tex-d-follow color-gray80 mb-1">11 hours ago</p>
            </div>
          </div>
          <hr className="my-2" />
        </div>{" "}
        {/* column */}
      </div>
      <div className="w-100">
        <div className="bt-block"></div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { user: state.user.data };
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPage);
