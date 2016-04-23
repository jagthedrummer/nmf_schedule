import Ember from 'ember';

const { computed } = Ember;

export default Ember.Service.extend({
  _shows: [],
  _showIds: [],
  _allShows: [],

  addShow(show) {
    console.log('calling addShow in the service!!!', show);
    const shows = this.get('_shows');
    if(shows.contains(show)){
      console.log('already contains show');
      shows.removeObject(show);
    }else{
      console.log('adding show');
      shows.addObject(show);
    }
    this.saveShowList();
    return false;
  },

  removeShow(show) {
    const shows = this.get('_shows');
    shows.removeObject(show);
    this.saveShowList();
  },

  saveShowList(){
    var showIds = this.get('_shows').mapBy('id');
    this.set('_showIds',showIds);
    localStorage.setItem('myShows',showIds);
  },

  shows: computed('_shows.[]', function() {
    return this.get('_shows').sortBy('sortableTime','stageName');
  }),

  initShows: function(){
    var showIds = (localStorage.getItem('myShows') || "").split(',');
    this.set('_showIds', showIds);
  }.on('init'),

  initEvents: function(events){
    this.set('_allShows',events);
  },

  reHydrateShows: Ember.observer('_showIds', '_allShows', function(){
    this.hydrateShows();
  }),

  hydrateShows: function(){
    var showIds = this.get('_showIds');
    var allShows = this.get('_allShows');
    var shows = this.get('_shows');
    showIds.forEach(function(showId){
      var show = allShows.findBy('id',showId);
      if(show){
        shows.addObject(show);
      }
    });
  }

});
