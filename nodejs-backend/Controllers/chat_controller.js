const { room_chat_model } = require("../Models");
const db = require("../Models");

const RoomChatModel = db.room_chat_model;
const RoomModel = db.room_model;

const dateFormat = require("dateformat");
const now = new Date();

exports.ListChat = (req,res) => {

    RoomModel.findAndCountAll({ 
    where : {status:'Open'},
    order: [['updatedAt', 'DESC'],],
    })
      .then(data =>{
        res.send({  
          status : 1,
          data : data
        });
      })
      .catch(err=>{ 
          res.status(500).send({
            status : false,
            message : err.message || "Some error occurred while retrieving List Chats."
          })
      })
}

exports.ListChatCount = (req,res) => {
  RoomModel.count({ 
  where : {status:'Open'},
  })
    .then(data =>{
      res.send({  
        status : 1,
        data : data
      });
    })
    .catch(err=>{ 
        res.status(500).send({
          status : false,
          message : err.message || "Some error occurred while retrieving Count List Chats."
        })
    })
}

exports.CreateRoom = (req, res) => {

  // Validate request
  if(!req.body) {
      res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
      return;
  }

  const room = {
      roomid : req.body.roomid,
      complainer_id : req.body.complainer_id,
      helpdesk_id : req.body.helpdesk_id,
      status: req.body.status,
      closetime: req.body.closetime,
  };

  RoomModel.create(room)
  .then(data => {
      res.send({
        status : true,
        data : data
      });
  })
  .catch(err => {
      res.status(500).send({
        status: false,
        message : err.message ||  "Some error occurred while creating the Rooms."
      });
  });

};

exports.ChatDetails = (req,res) => {

    // Validate request
    if(!req.query.roomid) {
      res.status(400).send({
        status: false,
        message: "Roomid can not be empty!"
      });
      return;
  }

    room_chat_model.findAndCountAll({ 
    where : {roomid:req.query.roomid},
    order: [['createdAt', 'ASC']],
    })
      .then(data =>{
        res.send({
          status : 1,
          data : data
        });
      })
      .catch(err=>{ 
          res.status(500).send({
            status : false,
            message : err.message || "Some error occurred while retrieving List Chats."
          })
      })
  
}

exports.HandleChat = (req,res) => {

  
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      status: false,
      message: "Content can not be empty!"
    });
  }

  const roomid = req.body.roomid;
  const helpdesk_id = req.body.helpdesk_id;

  RoomModel.update({helpdesk_id:helpdesk_id},{
    where : {roomid : roomid}
  })
  .then(num =>{
    if(num == 1){
      res.send({
        status : true,
        message: "Handle Chat was updated successfully."
      });
    }else{
      res.send({
        status : false,
        message: `Cannot Handle room with id=${roomid}. Maybe Room was not found or req.body is empty!`
      });
    }
  })
  .catch(err =>{
    res.status(500).send({
      status : false,
      message: "Error Handle with id=" + roomid
    });
  })
}



exports.HandOverHandler = (req, res) => {

  const roomid = req.body.roomid;
  const helpdesk_id = req.body.helpdesk_id;

    // Validate Request
    if (!req.body) {
      res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

  RoomModel.update({helpdesk_id:helpdesk_id},{
    where : {roomid : roomid}
  })
  .then(num =>{
    if(num == 1){
      res.send({
        status : true,
        message: "Handover Chat was updated successfully."
      });
    }else{
      res.send({
        status : false,
        message: `Cannot Handover room with id=${roomid}. Maybe Room was not found or req.body is empty!`
      });
    }
  })
  .catch(err =>{
    res.status(500).send({
      status : false,
      message: "Error Handover with id=" + roomid
    });
  })
};

exports.CloseChat = (req, res) => {

  
  // Validate Request
    if (!req.query.roomid) {
      res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }
  
  const roomid = req.query.roomid.trim();
    
  RoomModel.update({status:'Close', closetime: dateFormat(now,"isoUtcDateTime")},{
    where : {roomid : roomid}
  })
  .then(num =>{
    if(num == 1){
      res.send({
        status : true,
        message: "Close Chat was updated successfully."
      });
    }else{
      res.send({
        status : false,
        message: `Cannot Close room with roomid=${roomid} . Maybe Room was not found or req.body is empty!`
      });
    }
  })
  .catch(err =>{
    res.status(500).send({
      status : false,
      message: "Error Close with id=" + roomid
    });
  })
};

exports.OpenChat = (req, res) => {

  
  // Validate Request
    if (!req.body) {
      res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }
  
  const roomid = req.body.roomid;
  const helpdesk_id = req.body.helpdesk_id;
  
  RoomModel.update({status:'Open',helpdesk_id : helpdesk_id },{
    where : {roomid : roomid}
  })
  .then(num =>{
    if(num == 1){
      res.send({
        status : true,
        message: "Open Chat was updated successfully."
      });
    }else{
      res.send({
        status : false,
        message: `Cannot Open room with roomid=${roomid} . Maybe Room was not found or req.body is empty!`
      });
    }
  })
  .catch(err =>{
    res.status(500).send({
      status : false,
      message: "Error Open with id=" + roomid
    });
  })

};


exports.SendChat = (req, res) => {

    // Validate request
    if(!req.body) {
        res.status(400).send({
          status: false,
          message: "Content can not be empty!"
        });
        return;
    }

    RoomModel.findByPk(req.body.roomid)
        .then(data =>{
          
          if(!data){
            return res.status(404).send({
              status : 1,
              data : "Room id Not Found."
            });
          }

          if( data.helpdesk_id || req.body.sender.toLowerCase() == 'user' ){
            
            const send = {
              roomid : req.body.roomid,
              sender : req.body.sender,
              handler: data.helpdesk_id,
              message: req.body.message,
              type: req.body.type,
              read: 1,
            };
        
            RoomChatModel.create(send)
            .then(data => {

                RoomModel.update({ status : "Open"},{
                  where : {roomid : data.roomid}
                })
                .then(num =>{
                  if(num == 1){
                    res.send({
                      status : true,
                      data : data
                    });
                  }else{
                    res.send({
                      status : false,
                      message: `Cannot Updated room with roomid=${data.roomid} . Maybe Room was not found or req.body is empty!`
                    });
                  }
                })
                .catch(err =>{
                  res.status(500).send({
                    status : false,
                    message: "Error Updated with id=" + data.roomid
                  });
                })

              })
              .catch(err => {
                  res.status(500).send({
                    status: false,
                    message : err.message ||  "Some error occurred while Updated the Rooms."
                  });
              });
        
          }else{
            return res.status(404).send({
              status : 1,
              data : "Handler not found, please Handle first"
            });
          }

        })
        .catch(err=>{ 
            res.status(500).send({
              status : false,
              message : err.message || "Some error Send Chat."
        })
    })

};



