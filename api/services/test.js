/**
 * Created by nstyladmin on 7/12/2015.
 */
var _under = require('underscore');

module.exports = {
  createList: function createList(){
    var i=100;
    var list = sails.config.globals.list;
    while(i>0){
      list.push({iNum:"number is: "+ i });/*{i:"number: "+i}*/
      i--;
    }
    return list;
  },
  clearList: function clearList(){
    sails.config.globals.list = [];
  },
  createAndClear: function createAndClear(){
    var list = sails.config.globals.list;
    sails.log.info("List: Before Creating");
    this.createList();
    sails.log.info("List: Created");

    //
    sails.log.info("List: Before Deleting");
    this.createList();
    sails.log.info("List: Deleted");
  },
  printItem: function printItem(item){
    sails.log.info("List: " + item.iNum);
  },
  mapping: function mapping(){
    //
    var list = this.createList();
    _under.map(list,this.printItem);
  }
}
