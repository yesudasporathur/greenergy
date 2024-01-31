const User = require("../models/user");

const dashboard_get=(req,res)=>{ 
  res.render('admin-dashboard', { title: 'Admin Dash' });
  setTimeout(() => {
    console.log("Admin Dash rendered")
  }, 100);
}

module.exports={dashboard_get}