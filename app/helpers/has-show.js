import Ember from 'ember';

export function hasShow(params) {
  console.log('params= ',params);
  var allShows = params[0];
  var thisShowId = params[1];

  return !!allShows.findBy('id',thisShowId);
}

export default Ember.Helper.helper(hasShow);
