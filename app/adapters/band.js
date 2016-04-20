import Ember from 'ember';
import DS from 'ember-data';
import config from 'nmf-schedule/config/environment';
import { isError, parentID } from 'nmf-schedule/extractors/band';

export default DS.RESTAdapter.extend({

  proxy: config.APP.CORS_PROXY,
  host: config.APP.NMF_HOST,

  findRecord(store, type, id) {
    return new Ember.RSVP.Promise( (resolve, reject) => {

      var xhr = new XMLHttpRequest();

      console.log('buildUrl = ', this.buildUrl(`bands/${id}`));
      console.log('id = ', id);
      xhr.open("GET", this.buildUrl(`bands/${id}`), true);
      xhr.responseType = "document";

      var parent;

      xhr.onload = () => {
        if (isError(xhr.response)) {
          console.log('************** isError', xhr.response);
          Ember.run(null, reject, "Not found");
        } else if(parent = parentID(xhr.response)) {
          console.log('*************** parent thing');
          Ember.run(null, resolve, this.find(store, type, parent));
        } else {
          console.log('*************** ELSE');
          Ember.run(null, resolve, xhr.response);
        }
      };

      xhr.onerror = () => Ember.run(null, reject, xhr.statusText);

      xhr.send();

    });
  },

  buildUrl(path) {
    var parts = [];

    if (this.get("proxy")) {
      parts.push( this.get("proxy").replace(/\/$/, "") );
    }

    if (this.get("host")) {
      parts.push( this.get("host").replace(/\/$/, "") );
    }

    if (!parts.length) {
      parts.push("");
    }

    parts.push(path);

    return parts.join("/");
  },

});

