/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name:{
      type:'string',
      required: true
    },
    surname:{
      type:'string',
      required: true
    },
    age:{
      type: 'integer',
      required: true
    }
  },
  create100Users: function create100Users(){
    var i = 100;
    while(i>0){
      //sails.log.info(i);
      User.create({name:"name"+i,surname:'surname_'+i,age:i}).then(function(record){sails.log.info(record)}).catch(function(err){sails.log.error(err)});
      i--;
    }
  },
  removeAllUsers: function removeAllUsers(){
    User
      .destroy({age:{'>':0}})
      .then(function(deleted){})
      .catch(function(err){});
  }

};

