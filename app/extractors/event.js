import Ember from "ember";

var $ = Ember.$;

var guid = 0;

export function resetGuid() {
  guid = 0;
}

function toArray(arr) {
  return [].map.call(arr, item => item);
}

function extractID(possibleID) {
  var segments = possibleID.split('/');
  return segments[segments.length-2];
  //return(possibleID);
  //var match = /^(?:up_|item\?id=)(\d+)$/.exec(possibleID);
  //return (match && match[1]) || null;
}


function extractSource(source) {
  var match = /^\((.+)\)$/.exec(source);
  return (match && match[1]) || null;
}

function buildSortableTime(day, time){
  var sortableTime = 0;
  switch(day){
    case "thursday":
      sortableTime = 100000;
      break;

    case "friday":
      sortableTime = 200000;
      break;

    case "saturday":
      sortableTime = 300000;
      break;
  }
  var timePart = time.split(" ")[0],
      amPmPart = time.split(" ")[1],
      hourPart = parseInt(timePart.split(":")[0]),
      minPart  = parseInt(timePart.split(":")[1]);

  if(hourPart === 12){
    // leave it alone
  }else{ // afternoon
    hourPart += 12;
  }
  if(amPmPart === 'am'){
    hourPart += 12;
  }
  sortableTime += hourPart * 100;
  sortableTime += minPart;
  return sortableTime;
}

function extractEvent(row1/*, row2, row3, commentRows*/) {
  var event = {
    id:        null,
    day:       null,
    stage:     null,
    time:      null,
    band:      null,
    link:      null,
    sortableTime: null
  };

  var comments = [];

  event.id = extractID( $(".band-title a", row1).attr("href") );

  // An event on NMF Schedule usually look like this:
  //
  //      <li class="saturday bluebonnet-bar after-midnight ">
	//				<div class="schedule-item-info">
	//					<div class="show-time ">
  //					  12:00 am
	//					</div>
	//					<div class="band-title">
	//						<a href="http://normanmusicfestival.com/bands/tyler-hopkins-the-rebellion/">Tyler Hopkins &#038; The Rebellion</a>
	//					</div>
	//					<div class="show-stage">
	//						Bluebonnet Bar
  //					</div>
	//				</div>
	//			</li>
  //
  // We want to extract:
  //
  //   1. The Band:   "Tyler Hopkins &#038; The Rebellion"
  //   2. The link:   "http://normanmusicfestival.com/bands/tyler-hopkins-the-rebellion/"
  //   3. The day:    "saturday"
  //   4. The stage:  "Bluebonnet Bar"
  //   5. The time:   "12:00 am"
  //   6. The sortableTime: ??


  var $bandTag = $(".band-title a", row1),
      bandName = $bandTag.text().trim(),
      link =     $bandTag.attr("href"),
      className  = $(row1).attr('class'),
      day =      className.split(" ")[0],
      stageId =  className.split(" ")[1],
      time =     $(".show-time", row1).text().trim(),
      stageName =    $(".show-stage", row1).text().trim(),
      sortableTime = buildSortableTime(day, time);



  event.bandName = bandName;
  event.link = link;
  event.day = day;
  event.time = time;
  event.stageName = stageName;
  event.stageId = stageId;
  event.sortableTime = sortableTime;

  //if (event.url.indexOf("item?id=") === 0) {
    //event.tag = event.tag || "Discuss";
    //event.url = `https://news.ycombinator.com/${event.url}`;
  //}

  var source = $(".title .sitebit", row1).text().trim();

  if (source) {
    event.source = extractSource(source);
  }

  return [event, comments];
}

export function extractSingle(doc) {
  var rows = $("#hnmain table:eq(1) tr", doc);
  var commentRows = $("#hnmain table:eq(2) table", doc);

  var [event, comments] = extractEvent( rows[0], rows[1], rows[3], commentRows );

  return { event, comments };
}

export function extractArray(doc) {
  var meta = {},
      events = [],
      payload = { meta, events };

  //try {
    //meta.next = $("#hnmain tr:last-child a:contains(More)", doc).attr("href").split(/=|&/)[1];
  //} catch(e) {
    //meta.next = null;
  //}

  var rows = toArray( $("ul.schedule-list li", doc) );

  rows.forEach( row => {
    events.push( extractEvent(row)[0] );
  });

  return payload;
}

export function isError(doc) {
  return $("ul.schedule-list li", doc).length === 0;
}

export function parentID(doc) {
  return extractID( $("#hnmain table:eq(1) tr .comhead a:contains(parent)", doc).attr("href") );
}
