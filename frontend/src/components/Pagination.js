import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

var _ = require('lodash');

const Pagination =(props) => {

  /*
  currentDatas={currentDatas} 
  allResultCount={allResultCount}
  offset={offset} 
  pageLimit={pageLimit}
  */

  const [currentDatas, setCurrentDatas]     = useState([]);
  const [allResultCount, setAllResultCount] = useState(0);
  const [offset, setOffset]                 = useState(0)
  const [pageLimit, setPageLimit]           = useState(25);

  useEffect(() => {
    //----------------
    // console.log('props :', props)

    setCurrentDatas(props.currentDatas)
    setAllResultCount(props.allResultCount)
    setOffset(props.offset)
    setPageLimit(props.pageLimit)
  }, [props]);

  const pagination = () =>{
    return (
            <ul className="pagination mb-0">
              { 
              Array.from(Array(Math.ceil(allResultCount / pageLimit)).keys()).map((o, index)=>{

                if(offset/pageLimit === index){
                  return  <li key={index} className="page-item active" aria-current="page"> 
                            <a className="page-link" onClick={()=>{
                              props.onSetOffset(index)
                            }}>
                              {index + 1}
                            </a>
                          </li>
                }else{
                  return  <li className="page-item" key={index}>
                            <a className="page-link" onClick={()=>{
                              props.onSetOffset(index)
                            }}>
                              {index + 1}
                            </a>
                          </li>
                }
                
              })
              }
            </ul>
            )
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <nav className="mb-2 mt-4 mb-md-4">
          {/* <ul className="pagination mb-0"> */}
            {pagination()}
            {/* <li className="page-item disabled">
              <span className="page-link">
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item active" aria-current="page">
              <span className="page-link">2</span>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <span className="page-link">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </li> */}
          {/* </ul> */}
        </nav>
      </div>
      <div className="col-md-6">
        <div className="my-2 mb-4 mt-md-4 text-md-right">
          <div className="py-md-1">
            <span className="h4">{allResultCount}</span> <span className="h4">Items</span>
            <span className="d-inline-block ml-3 color-gray80">Page</span>
            <span className="d-inline-block ml-2 color-gray80">{offset/pageLimit+1}/</span>
            <span className="color-gray80">{Math.ceil(allResultCount / pageLimit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
