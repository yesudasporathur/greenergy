function timeConvert(str){
    const date = new Date(str);

// Get individual components of the date
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
const day = date.getDate().toString().padStart(2, '0');
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
const seconds = date.getSeconds().toString().padStart(2, '0');

// Format the date string
const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

return formattedDate

}

module.exports=timeConvert