/**
* User.js
*
 * @module User
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    surname: {
      type: 'string',
      required: true
    },
    age: {
      type: 'integer',
      required: true
    }
  },
  hello: function hello(){
    console.log("hello");
  },
};

