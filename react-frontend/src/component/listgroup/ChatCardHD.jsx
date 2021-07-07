import React from 'react';
import { MDBCard, MDBCardBody, MDBCol, MDBCardText,MDBIcon } from "mdbreact";
import moment from 'moment'

const ChatPanelHD = (props) => {
let date = new Date(props.chat.createdAt);
let send = props.chat.id;
return (
    <MDBCol md="12" sm='12' lg="12" >
      <MDBCard color="elegant-color" text="white" className="text-center">
        <MDBCardBody className="p-3 text-left"> 
            <MDBCardText style={{color:'white'}}>
            {props.chat.message}
            </MDBCardText>
            
            <MDBCardText style={{color:'white', fontWeight: "bold"}} className="text-right d-flex justify-content-between">
            <MDBIcon icon={send ? 'check-double' : 'check'} />
            {moment(date).format('LT')}
            </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
);
};

export default ChatPanelHD;