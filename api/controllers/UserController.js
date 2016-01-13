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
  },
  userlist: function userlist(req,res){
    if(req.isSocket){
      User.find()
          .then(function(users){
            User.subscribe(req,_.pluck(users, 'id'));
          })
          .catch(function(err){
            sails.log.info(err);
          })
    }
  },
  userupdate: function(req,res){

    //if(req.isSocket){
      var id = req.params['id'];
      var name = req.param('name');
      User.find({id:id})
          .then(function(users){
            users[0].name = name;
            users[0].save(function(err,s){
                User.publishUpdate(s.id,{ name:s.name });
              return res.ok()
            })
          })
          .catch(function(err){
            return res.badRequest();
          })
      return res.ok();
    //}
    //else
      //return res.badRequest();
  }

};

