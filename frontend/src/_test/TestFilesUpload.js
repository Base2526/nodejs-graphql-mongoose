import React, { useEffect, useState } from "react";
import axios from "axios";

var _ = require("lodash");
const TestFilesUpload = (props) => {
  // รูปภาพประกอบ
  const [files, setFiles] = useState([]);

  useEffect(async () => {});

  const changeFiles = async (e) => {
    let fileList = e.target.files;

    let temp_files = [...files];
    for (var i = 0; i < fileList.length; i++) {
      let file = fileList[i];

      let is_new = false;

      if (file !== undefined) {
        if (!_.isEmpty(temp_files)) {
          let find = temp_files.find((m) => {
            return m.name.localeCompare(file.name) === 0;
          });
          if (find === undefined) {
            is_new = true;
          }
        } else {
          is_new = true;
        }
      }

      console.log("file file ", file, is_new);
      if (is_new) {
        temp_files = [...temp_files, file];
      }
    }

    setFiles(temp_files);
  };

  const removeFile = (data) => {
    let remove_files = files.filter((file) => {
      if (file.name.localeCompare(data.name) === 0) {
        return false;
      }
      return true;
    });
    setFiles(remove_files);
  };

  const filePreview = () => {
    return files.map((file, key) => {
      return (
        <div key={key} style={{ display: "inline-block", padding: "5px" }}>
          <div>
            <img width="50" height="60" src={URL.createObjectURL(file)} />
            <div style={{ cursor: "pointer" }} onClick={() => removeFile(file)}>
              X
            </div>
          </div>
        </div>
      );
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // console.log("files : ", files);
    console.log("handleFormSubmit : ", files);
    const formData = new FormData();

    files.map((file) => {
      formData.append("files[]", file);
    });

    let response = await axios.post(`/api/v1/files`, formData, {
      headers: {
        // Authorization: `Basic ${ls.get("basic_auth")}`,
        "content-type": "multipart/form-data",
      },
    });

    response = response.data;

    console.log("/v1/files > ", response);

    // axios.delete()
  };

  const handleFormDeleteSubmit = async (e) => {
    e.preventDefault();

    let response = await axios.delete(`/api/v1/files`, {
      headers: {
        // Authorization: `Basic ${ls.get("basic_auth")}`,
        // "content-type": "multipart/form-data",
      },
      data: {
        _id: "6198ce8727dad903885257e5",
      },
    });

    response = response.data;

    console.log("/v1/files > handleFormDeleteSubmit");
  };

  return (
    <div>
      <form
        className="form-horizontal form-loanable"
        onSubmit={handleFormSubmit}
      >
        <fieldset>
          <legend>รูปภาพประกอบ :</legend>
          <div className="form-group has-feedback required">
            <label htmlFor="login-email" className="col-sm-5">
              รูปภาพประกอบ
            </label>
            <label className="custom-file-upload">
              <input type="file" multiple onChange={changeFiles} />
              <i className="fa fa-cloud-upload" /> Attach
            </label>

            <div className="file-preview">{filePreview()}</div>
          </div>

          <div className="form-action">
            <div className="col-sm-5">
              <input type="submit" className="button" value="Send file" />
            </div>
          </div>
        </fieldset>
      </form>
      {/* <form
        className="form-horizontal form-loanable"
        onSubmit={handleFormDeleteSubmit}
      >
        <div className="form-action">
          <div className="col-sm-5">
            <input type="submit" className="button" value="delete file" />
          </div>
        </div>
      </form> */}
    </div>
  );
};

export default TestFilesUpload;
