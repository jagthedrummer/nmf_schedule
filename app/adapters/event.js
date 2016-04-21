//import ApplicationAdapter from './application';

//export default ApplicationAdapter.extend({
//});

import Ember from 'ember';
import DS from 'ember-data';
import config from 'nmf-schedule/config/environment';
import { isError, parentID } from 'nmf-schedule/extractors/event';

export default DS.RESTAdapter.extend({

  //proxy: config.APP.CORS_PROXY,
  //host: config.APP.NMF_HOST,

  find(store, type, id) {
    return new Ember.RSVP.Promise( (resolve, reject) => {

      var xhr = new XMLHttpRequest();

      xhr.open("GET", this.buildUrl(`item?id=${id}`), true);
      xhr.responseType = "document";

      var parent;

      xhr.onload = () => {
        if (isError(xhr.response)) {
          Ember.run(null, reject, "Not found");
        } else if(parent = parentID(xhr.response)) {
          Ember.run(null, resolve, this.find(store, type, parent));
        } else {
          Ember.run(null, resolve, xhr.response);
        }
      };

      xhr.onerror = () => Ember.run(null, reject, xhr.statusText);

      xhr.send();

    });
  },

  findAll(store, type) { this.findQuery(store, type); },

  query(store, type, query = {}) {
    return new Ember.RSVP.Promise( (resolve, reject) => {

      var xhr = new XMLHttpRequest();

      xhr.open("GET", this.urlForQuery(query), true);
      xhr.responseType = "document";

      xhr.onload = () => {
        if (isError(xhr.response)) {
          Ember.run(null, reject, "Not found");
        } else {
          Ember.run(null, resolve, xhr.response);
        }
      };

      xhr.onerror = () => Ember.run(null, reject, xhr.statusText);
      xhr.send();

    });
  },

  urlForQuery({ filter, page }) {
    var url;

    filter = filter || "schedule";

    switch (filter) {
      //case "front-page":
        //url = "news";
        //break;

      case "schedule":
        url = "schedule.html";
        break;

      //case "active":
        //url = "active";
        //break;

      //case "show-hn":
        //url = "show";
        //break;

      //case "ask-hn":
        //url = "ask";
        //break;

      //case "jobs":
        //url = "jobs";
        //break;

      default:
        throw "Unknown filter: " + filter;
    }

    if (page && filter === "latest") {
      url += `?next=${ encodeURIComponent(page) }`;
    } else if (page) {
      url += `?p=${ encodeURIComponent(page) }`;
    }

    return this.buildUrl(url);
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
