import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});


Router.map(function() {
  this.route('day', { path: '/day/:dayId' }, function() {
    this.route('event', { path: '/:eventId' });
  });
  this.route('my-show', { path: '/my-show/:eventId' });
});

export default Router;
