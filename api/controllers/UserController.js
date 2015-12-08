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
  },
  add100Users: function add100Users(req,res){
    User.create100Users();
    res.ok();
  }

};

