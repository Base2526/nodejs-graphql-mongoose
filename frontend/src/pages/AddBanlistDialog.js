import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

import ls from 'local-storage';

import {isEmpty, onToast} from '../utils'

const AddBanlistDialog = (props) => {
  const [showModal, setShowModal] = React.useState(false);

  // 
  const [draft, setDraft]     = useState(false);
  
  const [nid, setNid]     = useState(0);
  const [title, setTitle] = useState();
  const [transferAmount, setTransferAmount] = useState();
  const [personName, setPersonName] = useState();
  const [personSurname, setPersonSurname] = useState();
  const [idCardNumber, setIdCardNumber] = useState();
  const [sellingWebsite, setSellingWebsite] = useState();
  const [transferDate, setTransferDate] = useState(new Date());
  const [ibody, setIbody] = useState();
  // บัญชีธนาคารคนขาย
  const [itemsMBA, setItemsMBA] = useState([]);
  // รูปภาพประกอบ
  const [files, setFiles] = useState([]);

  const [createLoading, setCreateLoading] = useState(false);

  const [itemsMerchantBankAccount, setItemsMerchantBankAccount] = useState([
    {'key':0,'value': '--เลือก--'},
    {'key':1,'value': 'ธนาคารกรุงศรีอยุธยา'},
    {'key':2,'value': 'ธนาคารกรุงเทพ'},
    {'key':3,'value': 'ธนาคารซีไอเอ็มบี'},
    {'key':4,'value': 'ธนาคารออมสิน'},
    {'key':5,'value': 'ธนาคารอิสลาม'},
    {'key':6,'value': 'ธนาคารกสิกรไทย'},
    {'key':7,'value': 'ธนาคารเกียรตินาคิน'},
    {'key':8,'value': 'ธนาคารกรุงไทย'},
    {'key':9,'value': 'ธนาคารไทยพาณิชย์'},
    {'key':10,'value': 'Standard Chartered'},
    {'key':11,'value': 'ธนาคารธนชาติ'},
    {'key':12,'value': 'ทิสโก้แบงค์'},
    {'key':13,'value': 'ธนาคารทหารไทย'},
    {'key':14,'value': 'ธนาคารยูโอบี'},
    {'key':15,'value': 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร'},
    {'key':16,'value': 'True Wallet'},
    {'key':17,'value': 'พร้อมเพย์ (PromptPay)'},
    {'key':18,'value': 'ธนาคารอาคารสงเคราะห์'},
    {'key':19,'value': 'AirPay (แอร์เพย์)'},
    {'key':20,'value': 'mPay'},
    {'key':21,'value': '123 เซอร์วิส'},
    {'key':22,'value': 'ธ.ไทยเครดิตเพื่อรายย่อย'},
    {'key':23,'value': 'ธนาคารแลนด์แอนด์เฮ้าส์'},
    {'key':24,'value': 'เก็บเงินปลายทาง'} 
  ]);

  useEffect(() => {
    setShowModal(props.showModal)
  });

  const handleFormDraft = async(e) => {

    setDraft(true)

    handleFormSubmit(e)
  }

  const handleFormSubmit = async(e) => {
    console.log("handleFormSubmit : ");
    e.preventDefault();

    console.log('title : ', title)
    console.log('transferAmount : ', transferAmount)
    console.log('personName : ', personName)
    console.log('personSurname : ', personSurname)
    console.log('idCardNumber : ', idCardNumber)
    console.log('sellingWebsite : ', sellingWebsite)
    console.log('transferDate : ', transferDate)
    console.log('ibody : ', ibody)
    console.log('itemsMBA : ', itemsMBA)
    console.log('files : ', files)

    if( isEmpty(title) || 
        isEmpty(transferAmount) ||
        isEmpty(personName) ||
        isEmpty(personSurname) ||
        isEmpty(idCardNumber) ||
        isEmpty(sellingWebsite) ||
        isEmpty(ibody) ){
          
      onToast('error', "title or transferAmount or personName or personSurname or idCardNumber or sellingWebsite or ibody")
    }else{

      const data = new FormData();
      data.append('draft', draft );
      data.append('nid', nid );
      data.append('product_type', title);
      data.append('transfer_amount', transferAmount);
      data.append('person_name', personName);
      data.append('person_surname', personSurname);
      data.append('id_card_number', idCardNumber);
      data.append('selling_website', sellingWebsite);
      data.append('transfer_date', transferDate);
      data.append('detail', ibody);
      data.append('merchant_bank_account', JSON.stringify(itemsMBA));
  
      files.map((file) => { data.append('files[]', file) })


      console.log("/v1/add_banlist start ")

      // setLoginLoading(true)
      let response =  await axios.post(`/v1/add_banlist`, data, { headers: {'Authorization': `Basic ${ls.get('basic_auth')}`, 'content-type': 'multipart/form-data'} });

      response = response.data

      console.log("/v1/add_banlist > ", response)

      if(response.result){
        props.onClose()
        onToast('info', "Add content success")
      }else{
        onToast('error', response.message)
      }

      /*
      setCreateLoading(true)

      axios.post(`/added_banlist?_format=json`, data, {
        headers: { 
          'Authorization': `Basic ${props.user.basic_auth}`,
          'content-type': 'multipart/form-data'
        }
      })
      .then((response) => {
        let results = response.data
        console.log("/added_banlist > ", results)
        
        if(results.result){
          // // true
          // console.log('true');
          // console.log(results);
  
          // // let {execution_time, datas, count} = results;
          // // console.log(execution_time);
          // // console.log(count);
          // // console.log(datas);
  
          // // if(datas && datas.length > 0){
          // //   _this.setState({spinner: false, execution_time, datas, count});
          // // }else{
  
          // _this.setState({spinner: false})
          // //   alert('Empty result.');
          // // }
  
          // let {navigation, route} = _this.props;
  
          // navigation.pop();
          // route.params.updateState({}); 
          
          props.onClose()
          
          onToast('info', "Add content success")
        }else{
          onToast('error', results.message)
        }

        setCreateLoading(false)
      })
      .catch((error) => {
        onToast('error', error)
        setCreateLoading(false)
      });
      */
    }

    /*
    const [title, setTitle] = useState();
    const [transferAmount, setTransferAmount] = useState();
    const [personName, setPersonName] = useState();
    const [personSurname, setPersonSurname] = useState();
    const [idCardNumber, setIdCardNumber] = useState();
    const [sellingWebsite, setSellingWebsite] = useState();
    const [transferDate, setTransferDate] = useState(new Date());
    const [ibody, setIbody] = useState();
    // บัญชีธนาคารคนขาย
    const [itemsMBA, setItemsMBA] = useState([]);
    // รูปภาพประกอบ
    const [files, setFiles] = useState([]);
    */
  };

  const onChange = (e) => {
    const val = e.target.value;
    console.log('onChange', val, e.target.id)
  }

  const removeItemsMBA = (itm) =>{
    console.log('removeItemsMBA : ', itm)

    // setFiles(files.filter((x) => x !== f))

    setItemsMBA(itemsMBA.filter((x)=>x.key !== itm.key))
  }

  const bodyContent = () =>{
    console.log('files :', files)
    return  <form className="form-horizontal form-loanable">
              {/* <div className="alert alert-danger alert-sm">
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                <span className="fw-semi-bold">Error:</span> Login failed.
              </div> */}
              <fieldset>
                {/* สินค้า/ประเภท */}
                <div className="form-group has-feedback required">
                  <label htmlFor="title" className="col-sm-5">สินค้า/ประเภท *</label>
                  <div className="col-sm-12">
                    <span className="form-control-feedback" aria-hidden="true"></span>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="form-control"
                      placeholder="สินค้า/ประเภท"
                      onChange={(e)=>{setTitle(e.target.value)}}
                      value={title}
                      // required
                    />
                  </div>
                </div>

                {/* ยอดเงิน */}
                <div className="form-group has-feedback required">
                  <label htmlFor="transfer-amount" className="col-sm-5">ยอดเงิน *</label>
                  <div className="col-sm-12">
                    <span className="form-control-feedback" aria-hidden="true"></span>
                    <input
                      type='number'
                      pattern='[0-9]{0,5}'
                      name="transfer_amount"
                      id="transfer-amount"
                      className="form-control"
                      placeholder="ยอดเงิน"
                      onChange={(e)=>{setTransferAmount(e.target.value)}}
                      value={transferAmount}
                      // required
                    />
                  </div>
                </div>

                {/* ชื่อบัญชี ผู้รับเงินโอน */}
                <div className="form-group has-feedback required">
                  <label htmlFor="sales-person-name" className="col-sm-5">ชื่อบัญชี ผู้รับเงินโอน *</label>
                  <div className="col-sm-12">
                    <span className="form-control-feedback" aria-hidden="true"></span>
                    <input
                      type="text"
                      name="sales_person_name"
                      id="sales-person-name"
                      className="form-control"
                      placeholder="ชื่อบัญชี ผู้รับเงินโอน"
                      onChange={(e)=>{ setPersonName(e.target.value) }}
                      value={personName}
                      // required
                    />
                  </div>
                </div>

                {/* นามสกุล ผู้รับเงินโอน */}
                <div className="form-group has-feedback required">
                  <label htmlFor="sales-person-surname" className="col-sm-5">นามสกุล ผู้รับเงินโอน</label>
                  <div className="col-sm-12">
                    <span className="form-control-feedback" aria-hidden="true"></span>
                    <input
                      type="text"
                      name="sales_person_surname"
                      id="sales-person-surname"
                      className="form-control"
                      placeholder="นามสกุล ผู้รับเงินโอน"
                      onChange={(e)=>{ setPersonSurname(e.target.value) }}
                      value={personSurname}
                    />
                  </div>
                </div>

                {/* เลขบัตรประชาชนคนขาย */}
                <div className="form-group has-feedback required">
                  <label htmlFor="id-card-number" className="col-sm-5">เลขบัตรประชาชนคนขาย</label>
                  <div className="col-sm-12">
                    <span className="form-control-feedback" aria-hidden="true"></span>
                    <input
                      type='number'
                      pattern='[0-9]{0,5}'
                      name="id_card_number"
                      id="id-card-number"
                      className="form-control"
                      placeholder="เลขบัตรประชาชนคนขาย"
                      onChange={(e)=>{ setIdCardNumber(e.target.value) }}
                      value={idCardNumber}
                    />
                  </div>
                </div>

                {/* เว็บไซด์ประกาศขายของ */}
                <div className="form-group has-feedback required">
                  <label htmlFor="selling-website" className="col-sm-5">เว็บไซด์ประกาศขายของ</label>
                  <div className="col-sm-12">
                    <span className="form-control-feedback" aria-hidden="true"></span>
                    <input
                      type="text"
                      name="selling_website"
                      id="selling-website"
                      className="form-control"
                      placeholder="เว็บไซด์ประกาศขายของ"
                      onChange={(e)=>{ setSellingWebsite(e.target.value) }}
                      value={sellingWebsite}
                      // required
                    />
                  </div>
                </div>

                {/* วันโอนเงิน */}
                <div className="form-group has-feedback required">
                  <label htmlFor="transfer-date" className="col-sm-5">วันโอนเงิน *</label>
                  <div className="col-sm-12">
                    <span className="form-control-feedback" aria-hidden="true"></span>
                    <DatePicker 
                      id="transfer-date"
                      selected={transferDate} 
                      onChange={date => setTransferDate(date) } />
                  </div>
                </div>

                {/* รายละเอียดเพิ่มเติม */}
                <div className="form-group has-feedback required">
                  <label htmlFor="body" className="col-sm-5">รายละเอียดเพิ่มเติม *</label>
                  <div className="col-sm-12">
                    <span className="form-control-feedback" aria-hidden="true"></span>
                    <textarea
                      name="body"
                      id="body"
                      className="form-control"
                      placeholder="รายละเอียดเพิ่มเติม"
                      multiline={true}
                      selected={ibody} 
                      onChange={(e) => {  setIbody(e.target.value) }} 
                      // required
                    />
                  </div>
                </div>

              </fieldset>
              <fieldset>
                {/* บัญชีธนาคารคนขาย */}
                <div className="form-group has-feedback required">
                  <label htmlFor="merchant-bank-account" className="col-sm-5">บัญชีธนาคารคนขาย</label>
                  <div style={{cursor: "pointer", 
                               display: "inline-block", 
                               padding: "6px 12px",
                               border: "1px solid #ccc" }} onClick={()=>{setItemsMBA([...itemsMBA, {key:itemsMBA.length, bank_account: "", bank_wallet: 0}])}}>+</div>
                </div>
   
                <div>
                  {
                    itemsMBA.map((it, index)=>{
                      return  <div class="col-sm-12">
                                <div>
                                  <div>
                                    <div style={{display: "inline-block"}}>เลขบัญชี</div> 
                                    <div style={{cursor: "pointer", display: "inline-block",  border: "1px solid rgb(204, 204, 204)", padding: "4px", marginLeft:"10px" }} onClick={()=>removeItemsMBA(it)} >X</div>
                                  </div>
                                  <div>
                                    <input
                                      type='number'
                                      pattern='[0-9]{0,5}'
                                      name={`bank_account[${index}]`}
                                      id={`bank-account[${index}]`}
                                      className="form-control"
                                      placeholder="เลขบัญชี"
                                      onChange={(e)=>{

                                        const val = e.target.value;
                                        // console.log('onChange', val, e.target.id)
                                        console.log('index : ', index, e.target.id, e.target.value, itemsMBA)


                                        let _itemsMBA = [...itemsMBA]

                                        let findi = _itemsMBA.findIndex((im)=>im.key === it.key)
                                        // console.log('itemsMBA-im : ', im)

                                        let data = _itemsMBA[findi];
                                        // console.log(itemsMerchantBankAccount, key)
                                        _itemsMBA[findi]  = {...data, bank_account: val}

                                        console.log('_itemsMBA : ', _itemsMBA)
                                        
                                        setItemsMBA(_itemsMBA)
                                      }}
                                      value={it.bank_account}
                                      // required
                                    />
                                  </div> 
                                </div>
                                <div>
                                  <select 
                                      value={it.bank_wallet}
                                      name={`bank_wallet[${index}]`}
                                      id={`bank-wallet[${index}]`}
                                      onChange={(e)=>{
                                        const val = e.target.value;
                                        // console.log('onChange', val, e.target.id)
                                        // console.log('index : ', index, e.target.id, e.target.value, itemsMBA)

                                        let _itemsMBA = [...itemsMBA]

                                        let findi = _itemsMBA.findIndex((im)=>im.key === it.key)
                                        // console.log('itemsMBA-im : ', im)

                                        let data = _itemsMBA[findi];
                                        // console.log(itemsMerchantBankAccount, key)
                                        _itemsMBA[findi]  = {...data, bank_wallet: val}

                                        console.log('_itemsMBA : ', _itemsMBA)
                                        
                                        setItemsMBA(_itemsMBA)

                                      }} >
                                      {
                                        itemsMerchantBankAccount.map((item)=>
                                          <option value={item.key}>{item.value}</option>
                                        )
                                      }
                                  </select>
                                </div>
                                
                              </div>
                    })
                  }
                </div>
              </fieldset>
              <fieldset>
                {/* รูปภาพประกอบ */}
                <div className="form-group has-feedback required">
                  <label htmlFor="login-email" className="col-sm-5">รูปภาพประกอบ</label>
                  <label className="custom-file-upload">
                    <input type="file" multiple onChange={changeFiles} />
                    <i className="fa fa-cloud-upload" /> Attach
                  </label>

                  <div className="file-preview">
                    {files.map((file) => {
                      return (
                        <div style={{ display: "inline-block", padding: "5px" }}>
                          {/* {file.name} */}
                          <div>
                            <img width="50" height="60" src={URL.createObjectURL(file)} />
                            <div style={{cursor: "pointer"}} onClick={()=>removeFile(file)}>X</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>                
              </fieldset>
              {/* <div className="form-action">
                <div class="col-sm-5">
                  <button
                    type="submit"
                    // disabled={isEmpty(searchWord) ? true : false}
                    onClick={(e)=>{
                      handleFormSubmit(e)
                    }}
                    className={"div-button"}>
                    Create
                    {createLoading && <CircularProgress size={10}/>}
                  </button>
                </div>
              </div> */}
            </form>
  }

  const changeFiles = (e) => {
    // console.log(
    //   "URL : ",
    //   URL.createObjectURL(e.target.files[0]),
    //   e.target.files[0]
    // );
    // var files = e.target.files;
    // console.log(files);
    var filesArr = Array.prototype.slice.call(e.target.files);
    console.log("filesArr : ", filesArr);
    // this.setState({ files: [...this.state.files, ...filesArr] });

    setFiles([...files, ...filesArr])
  }

  const removeFile = (f) => {
    // this.setState({ files: this.state.files.filter((x) => x !== f) });

    setFiles(files.filter((x) => x !== f))
  }
  
  return (
    <div>
      <Modal
        show={showModal}
        onHide={props.onClose}
        onSubmit={handleFormSubmit}
        bsSize="large"
        backdrop="static">
        <Modal.Header closeButton={true}>
          <h2>สร้าง เนื้อหาใหม่</h2>
        </Modal.Header>
        <Modal.Body>
          {bodyContent()}
        </Modal.Body>
        <Modal.Footer>
          {/* <div className="form-action">
            <div class="col-sm-5">
              <button
                type="submit"
                // disabled={isEmpty(searchWord) ? true : false}
                onClick={(e)=>{
                  handleFormSubmit(e)
                }}
                className={"div-button"}>
                Create
                {createLoading && <CircularProgress size={10}/>}
              </button>
            </div>
          </div> */}


          <Button variant="secondary" onClick={()=>props.onClose()}>Close</Button>
          <Button variant="primary" onClick={handleFormDraft} >Draft</Button>
          <Button variant="primary" onClick={handleFormSubmit} >Create</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
}

const mapStateToProps = (state, ownProps) => {
	return { user: state.user.data }
}

const mapDispatchToProps = {
  // fetchData,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBanlistDialog)