
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const salt = 'uniqueSalt';

const saltRounds = 10;


async function hashPassword(userPassword){
  return bcrypt.hash(userPassword, saltRounds)
}

async function cmpPassword(dataPassword,entryPassword){
  //console.log(dataPassword,entryPassword)
   
  const verifyVal= await bcrypt.compare(entryPassword, dataPassword)
  .then(res => {
    //console.log(res);
    return res
  })
  .catch(err => {
    //console.error(err.message)
    return err
  });
  return verifyVal

}

/*
function hashPassword(password) {
    // Create a hash object
    const hash = crypto.createHash('sha256');

    // Update the hash object with the password and salt
    hash.update(password + salt);

    // Get the hexadecimal representation of the hash
    const hashedPassword = hash.digest('hex');

    return hashedPassword;
}
*/
module.exports={hashPassword,cmpPassword}