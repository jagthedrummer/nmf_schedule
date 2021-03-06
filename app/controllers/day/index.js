import Ember from 'ember';
import $ from 'jquery';

const { inject } = Ember;

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),
  myShows: inject.service(),
  queryParams: ['selectedStage'],
  selectedStage: '',
  columns: [100],
  //sortProps: ['sortableTime','stageName'],
  //sortedEvents: Ember.computed.sort('model.events', 'sortProps'),
  

  filteredEvents: Ember.computed('model','model.events','selectedStage',function(){
    var events = this.get('model.events');
    var selectedStage = this.get('selectedStage');
    if(selectedStage.trim() === ''){
      return events;
    }else{
      return events.filter(event => event.get('stageName') === selectedStage);
    }
  }),

  handleResize: function() {
    this.get('applicationController').handleResize();
    var bodyContainerHeight = $('.body-container').height();
    var dayHeaderHeight = $('.body-container .day-header-row').height();
    var olHeight = bodyContainerHeight - dayHeaderHeight - 5;
    this.get('applicationController').set('olHeight', olHeight);
  },
  
  bindResizeEvent: function() {
    this.handleResize();
    $(window).on('resize', Ember.run.bind(this, this.handleResize));
  }.on('init'),

  unbindResizeEvent: function(){
    $(window).off('resize');
  }.on('willDestroy'),

  actions: {
    addShow(show) {
      console.log('running addShow');
      const myShows = this.get('myShows');
      myShows.addShow(show);
    },
    chooseTalk(event) {
      console.log('running chooseTalk', event);
      let talkId = $(event.target).closest('li').data('talk-id');
      if (talkId && event.target.nodeName !== 'I') {
        this.transitionToRoute('day.event', this.get('model.id'), talkId);
      }else{
        console.log('in the else', talkId, event.target.nodeName);
      }
    },
    scrollChange(left, top){
      this.setProperties({
        scrollTop: top,
        scrollLeft: left
      });
    }
  }
});

