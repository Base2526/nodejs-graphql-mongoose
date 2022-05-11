import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import ContactWebsiteDialog from './ContactWebsiteDialog'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import appStoreIcon from '../images/app-store-icon.png';
import googlePlayIcon from '../images/googleplay-icon.jpeg';

const Footer = (props) => {
    const history = useHistory();
    const [showModalContactWebsite, setShowModalContactWebsite]   = React.useState(false);
    useEffect(() => {
        
    })
    return (
        <div className="footer">
            { showModalContactWebsite && <ContactWebsiteDialog showModal={showModalContactWebsite} onClose = {()=>{  setShowModalContactWebsite(false) }}  /> }
            <div>
            <div>
                <div>
                    <div style={{cursor:'pointer'}} 
                        onClick={()=> window.open("https://www.facebook.com/banlistinfo", "_blank")}>
                    <span className="span-border-bottom">Fanpage facebook</span>
                    </div>
                </div>
                <div>
                    <div style={{cursor:'pointer'}} 
                        onClick={()=> window.open("https://twitter.com/8QGI1niUcDpQPin", "_blank")}>
                    <span className="span-border-bottom">Twitter</span>
                    </div>
                </div>

                {
                    props.maintenance
                    ?   <div />  
                    :   <div>
                            <div>
                                <div style={{cursor:'pointer'}} onClick={()=>{
                                    history.push({pathname: `/terms-of-service`, state: {} }) 
                                }}>
                                <span className="span-border-bottom">เงื่อนไขการใช้บริการ</span>
                                </div>
                            </div>
                            <div>
                                <div style={{cursor:'pointer'}} onClick={()=>{
                                    history.push({pathname: `/about-up`, state: {} }) 
                                }}>
                                <span className="span-border-bottom">เกี่ยวกับเรา</span>
                                </div>
                            </div>
                            <div>
                                <div style={{cursor:'pointer'}} onClick={()=>{
                                    history.push({pathname: `/for-developer`, state: {} }) 
                                }}>
                                <span className="span-border-bottom">สำหรับนักพัฒนา</span>
                                </div>
                            </div>
                            <div>
                                <div style={{cursor:'pointer'}} onClick={()=>{
                                    setShowModalContactWebsite(true)
                                }}>
                                <span className="span-border-bottom">ติดต่อเว็บไซต์</span>
                                </div>
                            </div>   
                        </div>
                }
                
                <div>
                    <LazyLoadImage
                        style={{borderRadius:"10px", cursor:"pointer"}}
                        alt={'apps.apple.com'}
                        width="250px"
                        height="100%"
                        effect="blur"
                        onClick={()=> window.open("https://apps.apple.com/", "_blank")}
                        placeholder={<div style={{textAlign:'center'}}><p>loading...</p></div>}
                        src={appStoreIcon} />
                </div> 
                
                <div>
                    <LazyLoadImage
                        style={{borderRadius:"10px", cursor:"pointer"}}
                        alt={'play.google.com'}
                        width="250px"
                        height="100%"
                        effect="blur"
                        onClick={()=> window.open("https://play.google.com/store/apps/details?id=mrx.bl", "_blank")}
                        placeholder={<div style={{textAlign:'center'}}><p>loading...</p></div>}
                        src={googlePlayIcon} />
                </div> 
            </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
	return {
        maintenance: state.setting.maintenance
    };
}

export default connect(mapStateToProps, null)(Footer)