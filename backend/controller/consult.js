  const Consult = require('../model/consult') 
  
  exports.acceptChat = async (req, res) => {
    const { doctorId, userId } = req.params;
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity
  
    await Consult.updateOne(
      { doctorId, userId, status: "pending" },
      { $set: { status: "accepted", expiryTime } }
    );
  
    res.status(200).json({ message: "Chat accepted, expires in 1 hour" });
  };
  
  exports.scheduleChat = async (req, res) => {
    const { doctorId, userId } = req.params;
    const { scheduleTime } = req.body;
  
    await Consult.updateOne(
      { doctorId, userId, status: "pending" },
      { $set: { status: "scheduled", scheduleTime } }
    );
  
    res.status(200).json({ message: `Chat scheduled for ${scheduleTime}` });
  };
  
  