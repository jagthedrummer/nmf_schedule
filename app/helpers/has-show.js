import Ember from 'ember';

export function hasShow(allShows, thisShow) {
  console.log('allShows = ',allShows);
  console.log('thisShow = ',thisShow);
  return !!allShows.findBy('id',thisShow.get('id'));
}

export default Ember.Helper.helper(hasShow);
