import Ember from 'ember';
const { inject } = Ember;
export default Ember.Component.extend({
  myShows: inject.service(),
  hasShow: function(){},
  actions:{
    addShow(show) {
      const myShows = this.get('myShows');
      myShows.addShow(show);
    },
    chooseTalk: function(){}
  }

});
