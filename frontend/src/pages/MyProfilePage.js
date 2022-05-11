import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faCamera,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import ls from "local-storage";

import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import { CircularProgress } from "@material-ui/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";

import { isEmpty } from "../utils";
import previewIcon from "../images/preview-icon.png";

import { userLogin, loadingOverlay } from "../actions/user";
import { addFriend } from "../actions/friends";

import history from "../history";

import preview from "../images/person_110935.png";

var _ = require("lodash");

const MyProfilePage = (props) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const [messageList, setMessageList] = useState([]);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState(true);

  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (_.isEmpty(props.user)) {
      history.push({ pathname: `/`, state: {} });
      return;
    }

    props.loadingOverlay(false);

    update();
  }, []);

  useEffect(() => {
    update();
  }, [props.user]);

  const update = () => {
    console.log("MyProfilePage : ", props);
    let { display_name, email, phone, images } = props.user;

    setName(display_name);
    setEmail(email);
    setPhone(phone);
    setImageUrl(_.isEmpty(images) ? "" : images.path);
  };

  const changeFiles = (e) => {
    var fileArr = Array.prototype.slice.call(e.target.files);
    setFiles(fileArr);
  };

  /*
    const onUpdate = () =>{
        setLoading(true)
        const data = new FormData();
        if(props.user.name !== name){
            data.append("type", 1);
            data.append("display_name", name)
        }

        if(!isEmpty(files)){
            data.append("type", 2);
            files.map((file) => { data.append('file', file) })
        }

        if(props.user.name !== name && !isEmpty(files)){
            data.append("type", 3);
        }

        axios.post(`/api/edit_profile`, 
            data, 
            {
                headers: { 
                    'Authorization': `Basic ${props.user.basic_auth}` ,
                    'content-type': 'multipart/form-data'
                }
            }
        )
        .then( (response) => {
            let results = response.data
            console.log(results) 

            setLoading(false)

            toast.info("Update success.", 
                    {
                        position: "bottom-right", 
                        hideProgressBar: true,
                        autoClose: 1000,
                    }) 
        })
        .catch((error) => {
            console.log(error) 

            toast.error("Error update.", 
                    {
                        position: "bottom-right", 
                        hideProgressBar: true,
                        autoClose: 1000,
                    }) 
        });
    }
    */

  const handleFormSubmit = async (e, fuc) => {
    console.log("handleFormSubmit : ");

    e.preventDefault();
    if (fuc === "form") {
      return;
    }

    let pass = true;

    setNameError("");

    if (_.isEmpty(name)) {
      pass = false;
      setNameError("กรุณากรอก");
    }

    if (pass) {
      props.loadingOverlay(true);

      const formData = new FormData();
      formData.append("_id", props.user._id);
      formData.append("name", name);
      formData.append("phone", phone);

      files.map((file) => {
        formData.append("files[]", file);
      });

      console.log("handleFormSubmit : ", fuc, formData, props.user._id);

      let response = await axios.post(`/v1/edit_profile`, formData, {
        headers: {
          Authorization: `${ls.get("basic_auth")}`,
          "content-type": "multipart/form-data",
        },
      });

      response = response.data;

      console.log("/v1/edit_profile > ", response);

      if (response.result) {
        let { data } = response;

        props.addFriend([data]);
        toast.info("Update profile sucess.", {
          position: "bottom-right",
          hideProgressBar: true,
          autoClose: 1000,
        });
      } else {
        toast.error("Error profile.", {
          position: "bottom-right",
          hideProgressBar: true,
          autoClose: 1000,
        });
      }

      props.loadingOverlay(false);
    }
  };

  const preview_profile = () => {
    // console.log("preview_profile : ", imageUrl);
    if (!_.isEmpty(files)) {
      if ("type" in files[0]) {
        return (
          <LazyLoadImage
            className="img-user"
            src={URL.createObjectURL(files[0])}
          />
        );
      }
    } else {
      return (
        <LazyLoadImage
          className="img-user"
          src={
            _.isEmpty(imageUrl)
              ? preview
              : process.env.REACT_APP_URL_SERVER + imageUrl
          }
        />
      );
    }
  };

  return (
    <div className="App">
      <form onSubmit={(e) => handleFormSubmit(e, "form")}>
        <div className="bg-gray25">
          <div className="container">
            <h3 className="text-center my-3 head-title">{name}</h3>
            <div className="box-profile">
              {preview_profile()}
              <label className="icon-cam bg-primary text-white">
                <input
                  type="file"
                  className="add-file"
                  onChange={(e) => changeFiles(e)}
                />
                <FontAwesomeIcon icon={faCamera} />
              </label>
            </div>
            <p className="mt-2 text-center allow-text">
              Allowed file types:png,jpg,jpeg
            </p>

            <div className="row">
              <div className="col-12 col-md-8 offset-md-2">
                <div className="form-group ">
                  <label htmlFor="validationCustom01">ชื่อ-สกุล</label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustom01"
                    placeholder="ชื่อ-สกุล"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  {_.isEmpty(nameError) ? (
                    ""
                  ) : (
                    <span className="form-control-feedback message-error">
                      {nameError}
                    </span>
                  )}
                </div>

                <div className="form-group ">
                  <label htmlFor="validationCustom02">อีเมล์</label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustom02"
                    placeholder="อีเมล์"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    readOnly
                  />
                </div>

                <div className="form-group ">
                  <label htmlFor="validationCustom03">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustom03"
                    placeholder="เบอร์โทรศัพท์"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>

                <div className="text-center py-3 pb-lg-4">
                  <button
                    className="btn bg-primary btn-submit m-2 "
                    type="submit"
                    onClick={(e) => handleFormSubmit(e, "submit")}
                  >
                    บันทึก
                  </button>
                  {/* <button
                    className="btn bg-gray20 btn-reset m-2"
                    type="submit"
                    onClick={(e) => handleFormSubmit(e, "reset")}
                  >
                    ยกเลิก
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log("MyProfilePage : ", state);
  return {
    user: _.find(state.friends.data, (i, j) => {
      return i._id == state.user.data._id;
    }),
  };
};

const mapDispatchToProps = {
  userLogin,
  loadingOverlay,

  addFriend,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
