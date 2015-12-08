/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  deleteAllUsers: function deleteAllUsers(req,res){
    User.removeAllUsers();
    res.ok();
  }

};

