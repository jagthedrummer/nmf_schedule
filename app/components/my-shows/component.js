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
    chooseShow: function(event){
      let talkId = $(event.target).closest('li').data('talk-id');
      if (talkId && event.target.nodeName !== 'BUTTON') {
        this.sendAction('chooseMyShow', talkId);
      }else{
      }
    }
  }

});
