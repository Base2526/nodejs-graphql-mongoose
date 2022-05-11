import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import Lightbox from "react-image-lightbox";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import Checkbox from "../components/Checkbox";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faCamera,
  faPlusCircle,
  faMinusCircle,
  faWindowClose,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import CustomDatePicker from "./Datepicker";

import ls from "local-storage";

import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import { CircularProgress } from "@material-ui/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";

import TextareaAutosize from "react-textarea-autosize";

import history from "../history";
import { RestoreFromTrash } from "@material-ui/icons";

import { isPhoneValid } from "../utils";

// import { addContentsData } from "../actions/app";
import { loadingOverlay, editPost } from "../actions/user";

var _ = require("lodash");

/// https://github.com/skptricks/react/blob/master/Form%20validation%20in%20reactjs/src/registrationForm/RegisterForm.js

let interval = undefined;
const EditPostPage = (props) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [personName, setPersonName] = useState("");
  // const [personSurname, setPersonSurname] = useState();
  const [idCardNumber, setIdCardNumber] = useState("");
  const [sellingWebsite, setSellingWebsite] = useState("");
  const [transferDate, setTransferDate] = useState(new Date());
  const [detail, setDetail] = useState("");
  // บัญชีธนาคารคนขาย
  const [itemsMBA, setItemsMBA] = useState([]);

  // setPhoneNumbers
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  // รูปภาพประกอบ
  const [files, setFiles] = useState([]);

  const [changeText, setChangeText] = useState("");

  const [createLoading, setCreateLoading] = useState(false);

  const [published, setPublished] = useState(false);

  const [titleError, setTitleError] = useState("");
  const [transferAmountError, setTransferAmountError] = useState("");
  const [personNameError, setPersonNameError] = useState("");

  const [transferDateError, setTransferDateError] = useState("");
  const [detailError, setDetailError] = useState("");

  const [datepick, setDatePick] = useState(new Date());

  const [itemsMerchantBankAccount, setItemsMerchantBankAccount] = useState([
    { key: 0, value: "--เลือก--" },
    { key: 1, value: "ธนาคารกรุงศรีอยุธยา" },
    { key: 2, value: "ธนาคารกรุงเทพ" },
    { key: 3, value: "ธนาคารซีไอเอ็มบี" },
    { key: 4, value: "ธนาคารออมสิน" },
    { key: 5, value: "ธนาคารอิสลาม" },
    { key: 6, value: "ธนาคารกสิกรไทย" },
    { key: 7, value: "ธนาคารเกียรตินาคิน" },
    { key: 8, value: "ธนาคารกรุงไทย" },
    { key: 9, value: "ธนาคารไทยพาณิชย์" },
    { key: 10, value: "Standard Chartered" },
    { key: 11, value: "ธนาคารธนชาติ" },
    { key: 12, value: "ทิสโก้แบงค์" },
    { key: 13, value: "ธนาคารทหารไทย" },
    { key: 14, value: "ธนาคารยูโอบี" },
    { key: 15, value: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร" },
    { key: 16, value: "True Wallet" },
    { key: 17, value: "พร้อมเพย์ (PromptPay)" },
    { key: 18, value: "ธนาคารอาคารสงเคราะห์" },
    { key: 19, value: "AirPay (แอร์เพย์)" },
    { key: 20, value: "mPay" },
    { key: 21, value: "123 เซอร์วิส" },
    { key: 22, value: "ธ.ไทยเครดิตเพื่อรายย่อย" },
    { key: 23, value: "ธนาคารแลนด์แอนด์เฮ้าส์" },
    { key: 24, value: "เก็บเงินปลายทาง" },
  ]);

  useEffect(() => {
    console.log(
      "EditPostPage ? 0000 ",
      props,
      props.match.params.id,
      props.location,
      props.data
    );

    setTitle(props.data.title);

    setPersonName(props.data.name_surname);

    setTransferAmount(props.data.transfer_amount);

    setIdCardNumber(props.data.id_card_number);

    // phone_numbers
    setPhoneNumbers(
      _.isEmpty(props.data.phone_numbers) ? [] : props.data.phone_numbers
    );

    setSellingWebsite(props.data.selling_website);
    setDetail(props.data.detail);

    setItemsMBA(
      _.isEmpty(props.data.merchant_bank_account)
        ? []
        : props.data.merchant_bank_account
    );
    setFiles(_.isEmpty(props.data.images) ? [] : props.data.images);

    setPublished(props.data.status);

    window.addEventListener("beforeunload", beforeunload);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, []);

  useEffect(() => {
    console.log("props.data :", props);
  }, [props]);

  const beforeunload = (e) => {
    e.preventDefault();
    e.returnValue = "";
    return false;
  };

  const toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum / 1000;
  };

  const reset = async (e) => {
    console.log("reset : ", e);
    // e.target.reset();
  };

  const handleFormSubmit = async (e, fuc) => {
    console.log("handleFormSubmit : ", phoneNumbers, fuc, itemsMBA);

    e.preventDefault();
    if (fuc === "form") {
      return;
    }

    props.loadingOverlay(true);

    let pass = true;

    setTitleError("");
    setTransferAmountError("");
    setPersonNameError("");
    setTransferDateError("");
    setDetailError("");

    if (_.isEmpty(title)) {
      pass = false;
      setTitleError("กรุณากรอก");
    }
    if (_.isEmpty(transferAmount)) {
      pass = false;
      setTransferAmountError("กรุณากรอก");
    }
    if (_.isEmpty(personName)) {
      pass = false;
      setPersonNameError("กรุณากรอก");
    }
    if (_.isEmpty([transferDate])) {
      pass = false;
      setTransferDateError("กรุณากรอก");
    }
    if (_.isEmpty(detail)) {
      pass = false;
      setDetailError("กรุณากรอก");
    }

    if (!_.isEmpty(phoneNumbers)) {
      setPhoneNumbers(
        phoneNumbers.map((item) => {
          return {
            ...item,
            valid: isPhoneValid(item.phone_number) ? true : false,
          };
        })
      );
    }

    if (!_.isEmpty(itemsMBA)) {
      setItemsMBA(
        itemsMBA.map((item) => {
          let valid = true;
          // if (!/^(?:\W*\d){10}\W*$/.test(item.bank_account)) {
          //   valid = false;
          // }
          if (!item.bank_wallet) {
            valid = false;
          }

          return {
            ...item,
            valid,
          };
        })
      );

      console.log("handleFormSubmit :  itemsMBA ", itemsMBA);
    }

    /*
     setItemsMBA([
                ...itemsMBA,
                {
                  key: _.random(1000, 9999),
                  bank_account: "",
                  bank_wallet: 0,
                  valid: true,
                },
              ]);
    */

    if (pass) {
      console.log("title : ", title);
      console.log("transferAmount : ", transferAmount);
      console.log("personName : ", personName);
      // console.log('personSurname : ', personSurname)
      console.log("idCardNumber : ", idCardNumber);
      console.log("phoneNumbers : ", phoneNumbers);
      console.log("sellingWebsite : ", sellingWebsite);
      console.log("transferDate : ", transferDate.getTime());
      console.log("detail : ", detail);
      console.log("itemsMBA : ", itemsMBA);
      console.log("files : ", files);

      const formData = new FormData();
      // formData.append("auto_save", false);

      formData.append("_id", props.data._id);
      formData.append("status", published);
      formData.append("product_type", title);
      formData.append("transfer_amount", transferAmount);
      formData.append("person_name", personName);
      // formData.append('person_surname', personSurname);
      formData.append("id_card_number", idCardNumber);
      formData.append("phone_numbers", JSON.stringify(phoneNumbers));
      formData.append("selling_website", sellingWebsite);
      formData.append("transfer_date", transferDate.getTime());
      formData.append("detail", detail);
      formData.append("merchant_bank_account", JSON.stringify(itemsMBA));

      let update_file = [];
      files.map((file) => {
        if ("type" in file) {
          formData.append("files[]", file);
        } else {
          update_file = [...update_file, file];
        }
      });

      formData.append("update_file", JSON.stringify(update_file));

      // console.log("/v1/add_banlist start files : ", formData)

      // setLoginLoading(true);
      let response = await axios.post(`/v1/edit_banlist`, formData, {
        headers: {
          Authorization: `${ls.get("basic_auth")}`,
          "content-type": "multipart/form-data",
        },
      });

      response = response.data;

      console.log("/v1/edit_banlist > ", response);

      if (response.result) {
        let { data } = response;

        props.editPost(data);

        toast.info("Update post sucess.", {
          position: "bottom-right",
          hideProgressBar: true,
          autoClose: 1000,
        });

        props.history.goBack();
      } else {
        toast.error("Update post error.", {
          position: "bottom-right",
          hideProgressBar: true,
          autoClose: 1000,
        });
      }
    }

    props.loadingOverlay(false);
  };

  const changeFiles = async (e) => {
    let fileList = e.target.files;

    let temp_files = [...files];
    for (var i = 0; i < fileList.length; i++) {
      let file = fileList[i];

      let is_new = false;

      if (file !== undefined) {
        if (!_.isEmpty(temp_files)) {
          let find = temp_files.find((m) => {
            if ("type" in m) {
              return m.name.localeCompare(file.name) === 0;
            }
          });
          if (find === undefined) {
            is_new = true;
          }
        } else {
          is_new = true;
        }
      }

      //   console.log("file file ", file, is_new);
      if (is_new) {
        temp_files = [...temp_files, file];
      }
    }

    console.log("temp_files >>", temp_files);
    setFiles(temp_files);
  };

  const removeFile = (data) => {
    console.log("removeFile :", data);
    if ("type" in data) {
      let remove_files = files.filter((file) => {
        if (file.name === data.name) {
          return false;
        }
        return true;
      });

      setFiles(remove_files);
    } else {
      let remove_files = _.map(files, (im) => {
        return im.fid === data.fid ? { ...im, is_delete: true } : im;
      });

      setFiles(remove_files);
    }
  };

  const removeItemsMBA = (itm) => {
    setItemsMBA(itemsMBA.filter((x) => x.key !== itm.key));
  };

  const removePhoneNumbers = (itm) => {
    setPhoneNumbers(phoneNumbers.filter((x) => x.key !== itm.key));
  };

  const filePreview = () => {
    return files.map((file, key) => {
      console.log(">> file ", file);
      if ("type" in file) {
        return (
          <div key={key} style={{ display: "inline-block", padding: "5px" }}>
            <div>
              <img
                style={{ width: "50px", height: "50px", resizeMode: "cover" }}
                /*width="50" height="50"*/ src={URL.createObjectURL(file)}
              />
              <div
                style={{ cursor: "pointer" }}
                onClick={() => removeFile(file)}
              >
                X
              </div>
            </div>
          </div>
        );
      } else {
        if (!("is_delete" in file)) {
          return (
            <div key={key} style={{ display: "inline-block", padding: "5px" }}>
              <div>
                <img
                  style={{ width: "50px", height: "50px", resizeMode: "cover" }}
                  /*width="50" height="50"*/ src={
                    process.env.REACT_APP_URL_SERVER + file.path
                  }
                />
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => removeFile(file)}
                >
                  X
                </div>
              </div>
            </div>
          );
        }
      }
    });
  };

  const countPicture = () => {
    let count = 0;
    files.map((file, index) => {
      if ("type" in file) {
        count++;
      } else {
        if (!("is_delete" in file)) {
          count++;
        }
      }
    });

    return count == 0 ? "" : "(" + count + ")";
  };

  return (
    <form onSubmit={(e) => handleFormSubmit(e, "form")}>
      <div className="col-12 col-md-8 offset-md-2">
        <div className="block-mtop mt-2 mt-md-4"></div>
        <div className="form-group ">
          <label htmlFor="validationCustom01">ชื่อเรื่อง *</label>
          <input
            type="text"
            className="form-control"
            id="validationCustom01"
            placeholder="ชื่อเรื่อง"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
          />
          {_.isEmpty(titleError) ? (
            ""
          ) : (
            <span className="form-control-feedback message-error">
              {titleError}
            </span>
          )}
        </div>

        <div className="form-group ">
          <label htmlFor="validationCustom02">ยอดเงิน *</label>
          <input
            type="text"
            className="form-control"
            id="validationCustom02"
            placeholder="ยอดเงิน"
            onChange={(e) => {
              setTransferAmount(e.target.value);
            }}
            value={transferAmount}
          />

          {_.isEmpty(transferAmountError) ? (
            ""
          ) : (
            <span className="form-control-feedback message-error">
              {transferAmountError}
            </span>
          )}
        </div>

        <div className="form-group ">
          <label htmlFor="validationCustom03">
            ชื่อบัญชี-นามสกุล ผู้รับเงินโอน *
          </label>
          <input
            type="text"
            className="form-control"
            id="validationCustom03"
            placeholder="ชื่อบัญชี ผู้รับเงินโอน"
            onChange={(e) => {
              setPersonName(e.target.value);
            }}
            value={personName}
          />
          {_.isEmpty(personNameError) ? (
            ""
          ) : (
            <span className="form-control-feedback message-error">
              {personNameError}
            </span>
          )}
        </div>

        <div className="form-group ">
          <label htmlFor="validationCustom04">เลขบัตรประชาชนคนขาย</label>
          <input
            type="text"
            className="form-control"
            id="validationCustom04"
            placeholder="เลขบัตรประชาชนคนขาย"
            onChange={(e) => {
              setIdCardNumber(e.target.value);
            }}
            value={idCardNumber}
          />
        </div>

        <div className="form-group d-flex align-items-center">
          <label htmlFor="validationCustom05" className="w-25">
            หมายเลขโทรศัพท์
          </label>
          <div>
            <button
              className="btn bg-primary text-white"
              onClick={() => {
                setPhoneNumbers([
                  ...phoneNumbers,
                  { key: _.random(1000, 9999), phone_number: "", valid: true },
                ]);
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </div>
        </div>

        <div className="form-group ml-md-4">
          {phoneNumbers.map((it, index) => {
            return (
              <div className="col-sm-12" key={index}>
                <div>
                  <label htmlFor="validationCustom06" className="mr-3">
                    เบอร์โทรศัพท์ {index + 1}
                  </label>
                  {/* <div
                    style={{
                      cursor: "pointer",
                      display: "inline-block",
                      border: "1px solid rgb(204, 204, 204)",
                      padding: "4px",
                      marginLeft: "10px",
                    }}
                    onClick={() => removePhoneNumbers(it)}
                  >
                    X
                  </div> */}

                  <button
                    className="btn bg-primary my-2 text-white"
                    onClick={() => removePhoneNumbers(it)}
                  >
                    <FontAwesomeIcon icon={faWindowClose} />
                  </button>
                </div>
                <span
                  className="form-control-feedback"
                  aria-hidden="true"
                ></span>
                <input
                  type="number"
                  pattern="[0-9]{0,5}"
                  name="id_card_number"
                  id="validationCustom06"
                  className="form-control"
                  // placeholder="เบอร์โทรศัพท์"
                  onChange={(e) => {
                    // setIdCardNumber(e.target.value)

                    const val = e.target.value;

                    let _phoneNumbers = [...phoneNumbers];

                    let findi = _phoneNumbers.findIndex(
                      (im) => im.key === it.key
                    );

                    let data = _phoneNumbers[findi];

                    _phoneNumbers[findi] = { ...data, phone_number: val };

                    // console.log("_itemsMBA : ", _phoneNumbers);

                    setPhoneNumbers(_phoneNumbers);

                    console.log(
                      ">> ",
                      e.target.value,
                      findi,
                      data,
                      _phoneNumbers
                    );
                  }}
                  value={it.phone_number}
                />

                {it.valid ? (
                  ""
                ) : (
                  <span className="form-control-feedback message-error">
                    กรุณากรอก
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="form-group ">
          <label htmlFor="validationCustom07">เว็บไซต์ประกาศขายของ</label>
          <input
            type="text"
            className="form-control"
            id="validationCustom07"
            placeholder="เว็บไซต์ประกาศขายของ"
            onChange={(e) => {
              setSellingWebsite(e.target.value);
            }}
            value={sellingWebsite}
          />
        </div>

        <div className="form-group ">
          <label htmlFor="validationCustom08">วันที่โอนเงิน *</label>

          <div className="position-relative">
            <CustomDatePicker
              wrapperClassName="datepicker"
              className="form-control"
              dateFormat="dd/MM/yyyy"
              selected={transferDate}
              onChange={(date) => setTransferDate(date)}
              // selected={datepick}
              // onChange={(date) => setDatePick(date)}
            />
            <FontAwesomeIcon icon={faCalendarAlt} className="btn-calendar" />
          </div>
          {_.isEmpty(transferDateError) ? (
            ""
          ) : (
            <span className="form-control-feedback message-error">
              {transferDateError}
            </span>
          )}
        </div>
        <div className="form-group ">
          <label htmlFor="validationCustom09">รายละเอียดเพิ่มเติม *</label>
          <textarea
            className="form-control settex-area"
            id="Textarrea01"
            placeholder="รายละเอียดเพิ่มเติม"
            // selected={detail}
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
            }}
          ></textarea>
          {_.isEmpty(detailError) ? (
            ""
          ) : (
            <span className="form-control-feedback message-error">
              {detailError}
            </span>
          )}
        </div>

        <div className="form-group d-flex align-items-center">
          <label htmlFor="validationCustom10" className="w-25">
            บัญชีธนาคารคนขาย
          </label>
          <button
            className="btn bg-primary text-white"
            onClick={() => {
              setItemsMBA([
                ...itemsMBA,
                {
                  key: _.random(1000, 9999),
                  bank_account: "",
                  bank_wallet: 0,
                  valid: true,
                },
              ]);
            }}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        </div>

        <div className="form-group ml-md-4">
          {itemsMBA.map((it, index) => {
            return (
              <div className="col-sm-12" key={index}>
                <div>
                  <div style={{ display: "inline-block" }}>
                    เลขบัญชี {index + 1}
                  </div>
                  <button
                    className="btn bg-primary my-2 text-white"
                    onClick={() => removeItemsMBA(it)}
                  >
                    <FontAwesomeIcon icon={faWindowClose} />
                  </button>

                  <input
                    type="number"
                    pattern="[0-9]{0,5}"
                    name={`bank_account[${index}]`}
                    placeholder="เลขบัญชี"
                    className="form-control mb-3"
                    id="validationCustom11"
                    onChange={(e) => {
                      const val = e.target.value;
                      // console.log('onChange', val, e.target.id)
                      console.log(
                        "index : ",
                        index,
                        e.target.id,
                        e.target.value,
                        itemsMBA
                      );

                      let _itemsMBA = [...itemsMBA];

                      let findi = _itemsMBA.findIndex(
                        (im) => im.key === it.key
                      );
                      // console.log('itemsMBA-im : ', im)

                      let data = _itemsMBA[findi];
                      // console.log(itemsMerchantBankAccount, key)
                      _itemsMBA[findi] = { ...data, bank_account: val };

                      console.log("_itemsMBA : ", _itemsMBA);

                      setItemsMBA(_itemsMBA);
                    }}
                    value={it.bank_account}
                    // required
                  />
                </div>

                <select
                  value={it.bank_wallet}
                  id="exampleFormControlSelect1"
                  className="form-control mb-3"
                  name={`bank_wallet[${index}]`}
                  id={`bank-wallet[${index}]`}
                  onChange={(e) => {
                    const val = e.target.value;
                    // console.log('onChange', val, e.target.id)
                    // console.log('index : ', index, e.target.id, e.target.value, itemsMBA)

                    let _itemsMBA = [...itemsMBA];

                    let findi = _itemsMBA.findIndex((im) => im.key === it.key);
                    // console.log('itemsMBA-im : ', im)

                    let data = _itemsMBA[findi];
                    // console.log(itemsMerchantBankAccount, key)
                    _itemsMBA[findi] = { ...data, bank_wallet: val };

                    console.log("_itemsMBA : ", _itemsMBA);

                    setItemsMBA(_itemsMBA);
                  }}
                  // required
                >
                  {itemsMerchantBankAccount.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.value}
                    </option>
                  ))}
                </select>

                {it.valid ? (
                  ""
                ) : (
                  <span className="form-control-feedback message-error">
                    กรุณากรอก
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="form-group d-flex align-items-center">
          <label htmlFor="validationCustom10" className="w-25">
            รูปภาพประกอบ {countPicture()}
          </label>
          <div>
            <label className="btn bg-primary text-white">
              <input type="file" multiple onChange={changeFiles} />
              <FontAwesomeIcon icon={faPlusCircle} />
            </label>
          </div>
        </div>
        <div className="form-group ml-md-4">{filePreview()}</div>

        <div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={published}
                onChange={() => {
                  setPublished(!published);
                }}
              />
              {published ? "ไม่เปิดเผย" : "เปิดเผย"}
            </label>
          </div>
        </div>

        <div className="text-center py-3 pb-lg-4">
          <button
            className="btn bg-primary btn-submit m-2 "
            type="submit"
            onClick={(e) => handleFormSubmit(e, "submit")}
          >
            แก้ไขโพสต์
          </button>
          <button
            className="btn bg-gray20 btn-reset m-2"
            type="reset"
            onClick={reset}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log("state :", state.app.data);
  return {
    user: state.user.data,
    data: state.user.posts.find((it) => it._id === ownProps.match.params.id), //state.app.data.find((it) => it._id === ownProps.match.params.id),
  };
};

const mapDispatchToProps = {
  // addContentsData,
  loadingOverlay,
  editPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPostPage);
