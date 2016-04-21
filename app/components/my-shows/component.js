import Ember from 'ember';
const { inject } = Ember;
export default Ember.Component.extend({
  myShows: inject.service(),
  hasShow: function(){},
  actions:{
    removeShow(show) {
      const myShows = this.get('myShows');
      myShows.removeShow(show);
    },
    chooseTalk: function(){}
  }

});
