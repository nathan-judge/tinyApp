const generateRandomString = function() {
  let randomString = "";
  return randomString += Math.floor((1 + Math.random()) * 0x10000).toString(6).substring(1);
};

// const idMatch = function (nameID, urlDatabase) {
//     // console.log("name.....", nameID)
//     // console.log("urldfatbase....", urlDatabase)
//     for (let url in urlDatabase) {
//         // console.log("url.....", urlDatabase[url].userID)
//         if (nameID && nameID.id === urlDatabase[url].userID) {
//             return nameID.id
//         } else {
//             return null
//         }
//     }

// }

const filterURLByUserid = function(nameID, urlDatabase) {
  let filterURLs = {};

  for (let url in urlDatabase) {


    if (nameID && nameID.id === urlDatabase[url].userID) {

      // console.log("nameid....", nameID)
      filterURLs[url] = urlDatabase[url];
    }
  }
  //console.log("fillll.....", filterURLs)
  return filterURLs;

};

const findUserByEmail = function(email, users) {
  return Object.values(users).find(user => user.email === email);


};
const emailAlreadyRegistered = function(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  filterURLByUserid,
  findUserByEmail,
  emailAlreadyRegistered
};