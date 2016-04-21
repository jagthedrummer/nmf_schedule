import Ember from 'ember';

const { computed } = Ember;

export default Ember.Service.extend({
  _shows: [],
  _showIds: [],
  _allShows: [],

  addShow(show) {
    const shows = this.get('_shows');
    shows.addObject(show);
    this.saveShowList();
  },

  saveShowList(){
    var showIds = this.get('_shows').mapBy('id');
    this.set('_showIds',showIds);
    localStorage.setItem('myShows',showIds);
  },

  shows: computed('_shows.[]', function() {
    console.log('_shows = ', this.get('_shows'));
    return this.get('_shows').sortBy('sortableTime','stageName');;
  }),

  initShows: function(){
    var showIds = localStorage.getItem('myShows').split(',');
    this.set('_showIds', showIds);
  }.on('init'),

  initEvents: function(events){
    console.log('--------------- calling initEvents');
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
      console.log('looking for ', showId);
      var show = allShows.findBy('id',showId);
      console.log('show = ', show);
      console.log('allShows = ', allShows);
      if(show){
        shows.addObject(show);
      }
    });
  }

});
