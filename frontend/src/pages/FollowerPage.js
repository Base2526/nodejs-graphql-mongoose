import React, { useEffect } from "react";
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Markup } from 'interweave';
import { CircularProgress } from '@material-ui/core';
import ls from 'local-storage';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretSquareUp,
  faEllipsisV,
  faUserAlt
} from "@fortawesome/free-solid-svg-icons";

import history from '../history';

var _ = require('lodash');

const FollowerPage = (props) => {
    const history = useHistory();
    const [datas, setDatas]  = React.useState([]);
    const [nid, setNid]  = React.useState(0);

    useEffect(async() => {
        
        // console.log('app_followers >>', props.app_followers)
        let app_followers = props.app_followers

        if(_.isEmpty(app_followers)){
            history.push("/");
            return;
        }

      
        let uids =  JSON.stringify(_.map(app_followers, 'uid')) 
        let response =  await axios.post(`/api/v1/get_followers`,  
                                        {uids}, 
                                        { 
                                            // headers: {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} 
                                            headers: {'Authorization': _.isEmpty(ls.get('basic_auth')) ? `Basic ${process.env.REACT_APP_AUTHORIZATION}` : ls.get('basic_auth')}
                                        });
        if(response.status === 200){
            
            let data = response.data
            console.log("/api/v1/get_followers : ", data)
            if(data.result){
                setDatas(data.datas)
            }
        }


        return () => {
            setDatas([])
        }
    }, [props.app_followers])

    // useEffect(async() => {
    //     let response =  await axios.post(`/api/v1/get_followers`,  {nid: props.match.params.nid}, { headers: {'Authorization': `Basic ${process.env.REACT_APP_AUTHORIZATION}`} });
    //     if(response.status === 200){
            
    //         let data = response.data
    //         console.log("/api/v1/get_followers : ", data)
    //         if(data.result){
    //             setDatas(data.datas)
    //         }
    //     }
    // }, [props.match.params.nid]);

    const items = () =>{
        return  datas.map((data, idx) => {
                            // return  <div key={idx}  style={{borderStyle: "dashed"}}>
                            //             <div>{data.uid}</div>
                            //             <div>{data.display_name}</div>
                            //             <div>{data.email}</div>
                            //             <div>{data.image_url}</div>
                            //         </div>

                            return <div className="mb-3">
                                        <div className="d-flex ">
                                        <div className="bx-icon">
                                            <a href="#" className="icon-users">
                                            <figure>
                                                <FontAwesomeIcon icon={faUserAlt} />
                                            </figure>
                                            </a>
                                        </div>
                        
                                        <div className="flex-grow-1 py-1 pl-md-2">
                                            <a href="#" className="d-inline-block text-dark title-head">
                                            <h3 className="h5 font-weight-bold  mb-1">Joe walker</h3>
                                            </a>
                                            <p className="tex-d-follow color-gray80 mb-1">
                                            i am a programer.., i need to build program.
                                            <FontAwesomeIcon
                                                icon={faEllipsisV}
                                                className="ml-3 bx-ellipsis"
                                            />
                                            </p>
                                        </div>
                        
                                        <div className="bxbtn-follow text-right">
                                            <button className="btn bg-primary btn-follow px-3">
                                            Follow
                                            </button>
                                        </div>
                                        </div>
                                        <hr className="my-2" />
                                    </div>
                         })
    }

    return (
        _.isEmpty(datas)
        ?   <div> <CircularProgress /> </div> 
        :   <div className="row">
                <div className="col-12"> { items() } </div>
                <div className="w-100">
                    <div className="bt-block"></div>
                </div>
            </div>)
}
  

const mapStateToProps = (state, ownProps) => {

    let data = _.find(state.app.data, (o)=>o.nid === parseInt(ownProps.match.params.nid))

    console.log('props.match.params.nid :', data)

    let app_followers = []
    if(_.has(data, 'app_followers')){
        app_followers = data.app_followers
    }

	return {
        user: state.user.data,
        data: state.app.data,

        app_followers: app_followers,

        maintenance: state.setting.maintenance
    };
}

const mapDispatchToProps = {
    // followUp,

    // addContentsData,
    // addFollowsData,
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerPage)