import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),
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
    chooseTalk(event) {
      let talkId = $(event.target).closest('li').data('talk-id');
      console.log('talkId = ', talkId);
      if (talkId && event.target.nodeName !== 'BUTTON') {
        this.transitionToRoute('day.event', this.get('model.id'), talkId);
      }else{
        console.log('skipping!');
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

