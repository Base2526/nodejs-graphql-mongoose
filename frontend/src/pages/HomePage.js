import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import ls from "local-storage";
import ReactPaginate from "react-paginate";
import { isMobile } from "react-device-detect";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import UseHomeItem from "./UseHomeItem";
import LoginDialog from "./LoginDialog";
import ModalFollwersDialog from "./ModalFollwersDialog";
import { onToast } from "../utils";
import {
  addContentsData,
  setTotalValue,
  updateAppFollower,
} from "../actions/app";
import {
  followUp,
  addHistory,
  deleteHistory,
  deleteHistoryAll,
  addFollowData,
} from "../actions/user";
import { addFriend } from "../actions/friends";
import { onMyFollow } from "../actions/my_follows";
import { addTEST } from "../actions/test";
import { socketIO } from "../SocketioClient";
import Autocomplete from "../components/Autocomplete";
import Comment from "../comments/Comment";
import { SEARCH_RESET } from "../constants";

import {EXCHANGE_RATES, POSTS} from '../gql'

var _ = require("lodash");

let {
  REACT_APP_DEBUG,
  REACT_APP_VERSIONS,
  REACT_APP_URL_SERVER,
  REACT_APP_GEOLOCATION,
  REACT_APP_AUTHORIZATION,
  REACT_APP_AXIOS_TIMEOUT,
} = process.env;




let socket = undefined;
const HomePage = (props) => {
  // const [currentNids, setCurrentNids] = useState([]);
  const [currentDatas, setCurrentDatas] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageLimit, setPageLimit] = useState(20);
  const [allResultCount, setAllResultCount] = useState(0);

  const [searchWord, setSearchWord] = useState("");
  // const [loading, setLoading] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalReport, setShowModalReport] = useState(false);
  const [showModalFollwersDialog, setShowModalFollwersDialog] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([
    "title",
    "name_surname",
  ]);

  const [offset, setOffset] = useState(0);
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [commentNid, setCommentNid] = useState(0);

  const [dataModalFollwer, setDataModalFollwer] = useState(null);

  const [itemsCategory, setItemCategory] = useState([
    { id: "title", title: "ชื่อเรื่อง" },
    { id: "name_surname", title: "ชื่อ-นามสกุล บัญชีผู้รับเงินโอน" },
    { id: "id_card_number", title: "เลขบัตรประชาชนคนขาย" },
    { id: "detail", title: "รายละเอียด" },
    { id: "merchant_bank_account.bank_account", title: "บัญชีธนาคาร" },
    { id: "item_phone_number.phone_number", title: "เบอร์โทรศัพท์" },
  ]);

  const test = async () => {
    let response = await axios.post(
      `/v1/conversation`,
      {
        receiverId: 66,
      },
      {
        headers: {
          Authorization: _.isEmpty(ls.get("basic_auth"))
            ? `Basic ${REACT_APP_AUTHORIZATION}`
            : ls.get("basic_auth"),
        },
      }
    );

    response = response.data;
    console.log("conversation > response :", response._id);
  };


  // async function fetchData() {

  
  // console.log("loa >>>", loa, error, data)

  // setLoading(loa)

  const useQueryPosts = () =>{
    const { loading, error, data } =  useQuery(POSTS);
  
    return { loading, error, data }
  }

  let { loading, error, data } = useQueryPosts()

  console.log("useEffect query:  ",  );

  /*
  useEffect(async () => {

    const params = new URLSearchParams(window.location.search); // id=123
    let p = params.get("p");
    if (!_.isEmpty(p)) {
      setOffset(pageLimit * (p - 1));
    }

    console.log("props.match >", props.match);

    //----------------
    socket = await socketIO(props);

    // props.deleteHistoryAll({});

    return () => {
      console.log("##########0");
      // props.addTEST({ BBBB: "MMM" });
    };
  }, []);

  useEffect(() => {
    //----------------
    console.log(">>>", isPaneOpen);
  }, [isPaneOpen]);

  useEffect(() => {
    // if( !_.isEmpty(currentPage) ){
    fetch();
    // }
  }, [offset]);

  useEffect(() => {
    if (_.isEmpty(socket)) {
      return;
    }

    // setCurrentDatas(
    //   _.map(currentNids, (o) => {
    //     socket.on(`content-${o}`, sycContent);
    //     return props.data.find((p) => p._id === o);
    //   }).filter((o) => !_.isEmpty(o))
    // );
    _.map(currentDatas, (item) => {
      console.log(`on content-${item._id}`);
      socket.on(`content-${item._id}`, sycContent);
      // return props.data.find((p) => p._id === o);
    });

    return () => {
      _.map(currentDatas, (item) => {
        console.log(`off content-${item._id}`);
        socket.off(`content-${item._id}`);
      });
    };
  }, [currentDatas]);

  */

  const sycContent = (i) => {
    // console.log("sycContent :", i);

    // fetch();
    switch (i.type) {
      case "contents": {
        // console.log("contents : ", i);
        switch (i.operation_type) {
          case "insert":
          case "update":
          case "replace": {
            let new_current_datas = _.map(currentDatas, (item, key) => {
              return i.datas._id === item._id ? i.datas : item;
            });

            console.log("currentDatas :", currentDatas, i, new_current_datas);
            setCurrentDatas(new_current_datas);
            break;
          }
        }

        break;
      }
      case "follows": {
        // let datas = i.datas;
        // console.log("sycContent > follows :", datas);
        // // updateAppFollower
        // props.updateAppFollower(datas);
        break;
      }
    }
  };

  useEffect(() => {
    if (!_.isEmpty(searchWord)) {
      if (searchWord === SEARCH_RESET) {
        fetch();
      } else {
        handleFormSearch();
      }
    }
  }, [searchWord]);

  const handleFormSearch = async () => {
    console.log("handleFormSearch > ", searchWord, selectedCheckboxes);

    if (_.isEmpty(searchWord) || _.isEmpty(selectedCheckboxes)) {
      onToast("error", "Please select category");
    } else {
      try {
        let { addHistory } = props;

        addHistory({
          search_text: searchWord,
          search_category: selectedCheckboxes,
        });

        // setLoading(true);

        let response = await axios.post(
          REACT_APP_DEBUG ? "/v1/search" : REACT_APP_URL_SERVER + "/v1/search",
          {
            type: 9999,
            key_word: searchWord,
            offset,
            full_text_fields: JSON.stringify(selectedCheckboxes),
            page_limit: pageLimit,
          },
          {
            headers: {
              Authorization: _.isEmpty(ls.get("basic_auth"))
                ? `Basic ${REACT_APP_AUTHORIZATION}`
                : ls.get("basic_auth"),
            },
          }
        );

        response = response.data;
        console.log("response", response, pageLimit);
        if (response.result) {
          let { datas, all_result_count } = response;

          console.log("datas>> ", datas);
          // props.addContentsData(datas);
          setCurrentDatas(datas);
          // setCurrentNids(_.map(datas, _.property("_id")));

          setAllResultCount(all_result_count);
        }
      } catch (e) {
        console.log("Error", e.message);
      }

      // setLoading(false);
    }
  };

  const clearSearch = () => {
    setCurrentPage(0);
  };

  const fetch = async () => {
    try {
      // setLoading(true);
      let response = await axios.post(
        REACT_APP_DEBUG ? "/v1/search" : REACT_APP_URL_SERVER + "/v1/search",
        {
          type: 0,
          key_word: "*",
          offset,
          page_limit: pageLimit,
        },
        { timeout: REACT_APP_AXIOS_TIMEOUT },
        {
          headers: {
            Authorization: _.isEmpty(ls.get("basic_auth"))
              ? `Basic ${REACT_APP_AUTHORIZATION}`
              : ls.get("basic_auth"),
          },
        }
      );

      // axios_timeout AXIOS_TIMEOUT

      response = response.data;
      console.log("response :::", response);
      if (response.result) {
        let { execution_time, datas, count, all_result_count } = response;

        // props.addContentsData(datas);
        setCurrentDatas(datas);
        // props.setTotalValue(all_result_count);

        // pageCount: Math.ceil(data.meta.total_count / data.meta.limit),
        // setPageCount( Math.ceil(all_result_count / pageLimit) )
        // console.log('response > datas :', datas)
        // setCurrentDatas(datas)

        // setCurrentNids(_.map(datas, _.property("_id")));

        setAllResultCount(all_result_count);
      } else {
        console.log("response > message :::", response.message);
      }

      // console.log(window.device.version);
    } catch (e) {
      console.log("Error", e.message);
    }

    // setLoading(false);
  };

  const toggleCheckbox = (data) => {
    // console.log('checked :', data.target.checked)
    // console.log('id :', data.target.id)

    if (data.target.checked) {
      setSelectedCheckboxes([...selectedCheckboxes, data.target.id]);
    } else {
      setSelectedCheckboxes(
        _.filter(selectedCheckboxes, (o) => o !== data.target.id)
      );
    }
  };

  const updateState = (data) => {
    switch (Object.keys(data)[0]) {
      case "showModalLogin": {
        setShowModalLogin(Object.values(data)[0]);
        break;
      }
      case "showModalReport": {
        setShowModalReport(Object.values(data)[0]);
        break;
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <CircularProgress />;
    } else {
      // return data.map((item, index) => {}
      console.log("renderContent : ", data)
      return  _.map(data.Posts.data, (item, index)=>{
                return <UseHomeItem
                          key={index}
                          {...props}
                          item={item}
                          updateState={updateState}
                          addFollowData={(data) => {
                            console.log(
                              "addFollowData : ",
                              data,
                              currentDatas,
                              props.user._id
                            );
              
                            let new_data = _.map(currentDatas, (item, key) => {
                              if (data._id == item._id) {
                                if (_.has(item, "followers")) {
                                  let followers = item.followers;
                                  let find = _.find(
                                    followers,
                                    (i, j) => i.uid == props.user._id
                                  );
              
                                  if (_.isEmpty(find)) {
                                    followers = [
                                      ...followers,
                                      { uid: props.user._id, status: data.status },
                                    ];
                                  } else {
                                    followers = _.map(followers, (i, j) => {
                                      if (i.uid === props.user._id) {
                                        i.status = data.status;
                                      }
                                      return i;
                                    });
                                  }
              
                                  item = {
                                    ...item,
                                    followers,
                                  };
                                } else {
                                  item = {
                                    ...item,
                                    followers: [{ uid: props.user._id, status: data.status }],
                                  };
                                }
                              }
              
                              return item;
                            });
                            console.log("addFollowData : new_data ", new_data);
              
                            setCurrentDatas(new_data);
              
                            props.addFollowData(data);
                          }}
                          onComment={(data) => {
                            console.log("onComment open > ", data);
                            setIsPaneOpen(true);
                            setCommentNid(data._id);
                          }}
                          onOpenModalFollwers={(data) => {
                            console.log("setShowModalFollwersDialog : ", data);
                            setShowModalFollwersDialog(data.is_open);
                            setDataModalFollwer(
                              _.isEmpty(data.item.followers) ? [] : data.item.followers
                            );
                          }}
                          // is_open: true
                          // item
                        />
              })
    }
  }

  /*
  const renderContent = () => {
    if (loading) {
      return <CircularProgress />;
    } else {
      if (_.isEmpty(currentDatas)) {
        return <div>Not found</div>;
      }

      console.log("currentDatas >>", currentDatas);
      return currentDatas.map((item, index) => {
        console.log(">>>> index : ", index, item);
        return (
          <UseHomeItem
            key={index}
            {...props}
            item={item}
            updateState={updateState}
            addFollowData={(data) => {
              console.log(
                "addFollowData : ",
                data,
                currentDatas,
                props.user._id
              );

              let new_data = _.map(currentDatas, (item, key) => {
                if (data._id == item._id) {
                  if (_.has(item, "followers")) {
                    let followers = item.followers;
                    let find = _.find(
                      followers,
                      (i, j) => i.uid == props.user._id
                    );

                    if (_.isEmpty(find)) {
                      followers = [
                        ...followers,
                        { uid: props.user._id, status: data.status },
                      ];
                    } else {
                      followers = _.map(followers, (i, j) => {
                        if (i.uid === props.user._id) {
                          i.status = data.status;
                        }
                        return i;
                      });
                    }

                    item = {
                      ...item,
                      followers,
                    };
                  } else {
                    item = {
                      ...item,
                      followers: [{ uid: props.user._id, status: data.status }],
                    };
                  }
                }

                return item;
              });
              console.log("addFollowData : new_data ", new_data);

              setCurrentDatas(new_data);

              props.addFollowData(data);
            }}
            onComment={(data) => {
              console.log("onComment open > ", data);
              setIsPaneOpen(true);
              setCommentNid(data._id);
            }}
            onOpenModalFollwers={(data) => {
              console.log("setShowModalFollwersDialog : ", data);
              setShowModalFollwersDialog(data.is_open);
              setDataModalFollwer(
                _.isEmpty(data.item.followers) ? [] : data.item.followers
              );
            }}
            // is_open: true
            // item
          />
        );
      });
    }
  };
  */

  const onSetOffset = (data) => {
    setOffset(data * pageLimit);
  };

  return (
    <div>
      <div>
        <div>
          <Autocomplete
            placeholder={"input keyword"}
            suggestions={_.map(props.historys, (o) => o.search_text).slice(
              0,
              10
            )}
            onSearch={(search_text) => {
              setSearchWord(search_text);
            }}
            onDeleteHistory={(search_text) => {
              props.deleteHistory({ search_text });
            }}
          />

          <div className="search-catogory mb-3">
            <label className="d-block text-dark font-weight-bold">
              Search by catogory
            </label>
            {
              // selectedCheckboxes
              itemsCategory.map((itm, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={itm.id}
                      onChange={(data) => {
                        toggleCheckbox(data);
                      }}
                      value={itm.id}
                      key={itm.id}
                      // defaultChecked={checked}
                      defaultChecked={
                        selectedCheckboxes.find((item) => item === itm.id) ===
                        undefined
                          ? false
                          : true
                      }
                    />
                    <label className="form-check-label" htmlFor="Checkbox1">
                      {itm.title}
                    </label>
                  </div>
                );
              })
            }
          </div>
        </div>
        {/* </form> */}
      </div>
      <div className="row">{renderContent()}</div>

      {_.isEmpty(currentDatas) ? (
        <div />
      ) : (
        <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
          <div className="d-flex flex-row py-4 align-items-center">
            <ReactPaginate
              pageCount={Math.ceil(allResultCount / pageLimit)}
              pageRangeDisplayed={isMobile ? 1 : 2}
              marginPagesDisplayed={isMobile ? 0 : 2}
              onPageChange={(data) => {
                let selected = data.selected;
                let offset = Math.ceil(selected * pageLimit);

                props.history.push({
                  pathname: `/`,
                  search: `?p=${selected + 1}`,
                  state: {},
                });

                setOffset(offset);
              }}
              containerClassName="pagination"
              activeClassName="active"
              pageLinkClassName="page-link"
              breakLinkClassName="page-link"
              nextLinkClassName="page-link"
              previousLinkClassName="page-link"
              pageClassName="page-item"
              breakClassName="page-item"
              nextClassName="page-item"
              previousClassName="page-item"
              previousLabel={<>&laquo;</>}
              nextLabel={<>&raquo;</>}
              initialPage={offset / pageLimit}
            />
          </div>
          <div className="col-md-6">
            <div className="my-2 mb-4 mt-md-4 text-md-right">
              <div className="py-md-1">
                <span className="h4">{allResultCount}</span>{" "}
                <span className="h4">Items</span>
                <span className="d-inline-block ml-3 color-gray80">Page</span>
                <span className="d-inline-block ml-2 color-gray80">
                  {offset / pageLimit + 1}/
                </span>
                <span className="color-gray80">
                  {Math.ceil(allResultCount / pageLimit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPaneOpen && (
        <Comment
          commentNid={commentNid}
          comments={
            _.isEmpty(commentNid)
              ? []
              : _.find(currentDatas, (i, j) => i._id == commentNid).comments
          }
          isPaneOpen={isPaneOpen}
          onClose={() => {
            setIsPaneOpen(false);
          }}
          onComment={(data) => {
            setCurrentDatas(
              _.map(currentDatas, (im, ik) => {
                if (im._id == data._id) {
                  if (!_.isEqual(im.comments, data.comments)) {
                    im = { ...im, comments: data.comments };
                  }
                }

                return im;
              })
            );
          }}
        />
      )}
      {showModalLogin && (
        <LoginDialog
          showModal={showModalLogin}
          mode={"login"}
          onClose={() => {
            setShowModalLogin(false);
          }}
        />
      )}

      {showModalFollwersDialog && (
        <ModalFollwersDialog
          showModal={showModalFollwersDialog}
          // mode={"login"}
          data={
            _.isEmpty(dataModalFollwer)
              ? []
              : _.filter(dataModalFollwer, (item) => item.status)
          }
          // friends={props.friends}
          onClose={() => {
            setShowModalFollwersDialog(false);
          }}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  console.log("mapStateToProps : ", state);
  return {
    user: state.user.data,
    follows: state.user.follows,
    data: state.app.data,

    total_value: state.app.total_value,
    follow_ups: state.user.follow_ups,

    my_apps: state.user.my_apps,
    my_follows: state.my_follows.data,

    socket_connected: state.data,

    historys: state.user.historys,

    friends: state.friends.data,
  };
};

const mapDispatchToProps = {
  addContentsData,
  setTotalValue,
  followUp,

  onMyFollow,

  addFollowData,

  addHistory,
  deleteHistory,
  deleteHistoryAll,

  updateAppFollower,

  addFriend,

  addTEST,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
