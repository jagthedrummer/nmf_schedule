import Ember from "ember";

var $ = Ember.$;


function extractID(possibleID) {
  console.log('extracting ID from ', possibleID);
  var segments = possibleID.split(' ');
  var id = segments[segments.length-1];
  console.log('extracted id = ', id);
  return id;
  //return(possibleID);
  //var match = /^(?:up_|item\?id=)(\d+)$/.exec(possibleID);
  //return (match && match[1]) || null;
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

function extractBand(body) {
  var band = {
    id:        null,
    imageUrl:  null,
    description:     null,
    socialLinks:     null
  };

  band.id = extractID( $(body).attr("class") );

  // An event on NMF Schedule usually look like this:
  //
  //      <section class="band-single">
	//        <div class="width">
	//		    <h2>Cloud Nothings</h2>
	//		    <ul class="band-social">
	//		      <li><a href="http://cloudnothings.com" target="_blank">Website</a></li>
	//					<li><a href="https://www.facebook.com/cloudnothings" target="_blank">Facebook</a></li>
	//					<li><a href="https://twitter.com/cloudnothingsHQ" target="_blank">Twitter</a></li>
	//					<li><a href="https://soundcloud.com/cloudnothings" target="_blank">SoundCloud</a></li>
	//				</ul>
	//				<ul class="band-show-time">
	//				  ...
	//				</ul>
	//				<div class="band-content">
	//			    <div id="attachment_1344" style="width: 970px" class="wp-caption aligncenter">
  //			      <img src="http://normanmusicfestival.com/wp-content/uploads/2015/10/cloudnothings.jpg" alt="Photo: Pooneh Ghana" width="960" height="640" class="size-full wp-image-1344" srcset="http://normanmusicfestival.com/wp-content/uploads/2015/10/cloudnothings-300x200.jpg 300w, http://normanmusicfestival.com/wp-content/uploads/2015/10/cloudnothings.jpg 960w" sizes="(max-width: 960px) 100vw, 960px" />
  //			      <p class="wp-caption-text">Photo: Pooneh Ghana</p>
  //			    </div>
  //          <p>Cloud Nothings was founded in a Cleveland basement, the one-man recording project of Dylan Baldi, an unassuming, then 18-year-old student of song with a breathtaking ear for melody. Prolific from the start, Baldi’s early work was rough but immediate: crudely recorded, spring-loaded spasms of Buzzcocks-informed pop that quickly found an online following among the lo-fi-inclined. When an opportunity presented itself to open a small show in Brooklyn, Baldi abandoned a still-in-progress final project to be there. The gamble paid off — he’s been touring ever since, using every available break to write and record more.</p>
  //          <p>In 2010, Carpark unveiled Turning On, a retrospective introduction that combined early 7? singles and the full-length debut (a limited release on cassette and vinyl) from which it took its name. The following year, Cloud Nothings made its proper Carpark debut with a thrilling self-titled LP that found Baldi in a studio for the first time, shedding the many layers of hiss and distortion that had once obscured (or enhanced) his every sugary hook. What followed was an unexpected breakthrough, 2012?s Attack on Memory, an album that very loudly (with the help of producer Steve Albini) announced the arrival of Cloud Nothings as the sound of more than just Baldi: Caustic and gargantuan, it marked the first time our young hero wrote with and for his longtime touring band, drummer Jayson Gerycz, bassist TJ Duke and since departed guitarist Joe Boyer. Touring intensified, rock critics slobbered, and the ceiling was raised considerably.</p>
  //          <p>Enter yet another first: the highly-anticipated follow-up. Here and Nowhere Else is the sound of Baldi further realizing his potential not just as a collaborative bandleader but a singer as well. The sometimes frightening interplay that galvanized its predecessor is refined here, Baldi’s cyclonic guitar parts and Gerycz’s seismic drumwork more tightly clenched and nuanced than they’ve ever been before. It’s an album every bit as ferocious as what we’ve recently come to expect — only smarter.</p>
  //          <p><iframe width="500" height="281" src="https://www.youtube.com/embed/YRR2c4akWjw?feature=oembed" frameborder="0" allowfullscreen></iframe></p>
	//				</div>
	//				<div class="width">
	//      </section>
  //
  // We want to extract:
  //
  //   1. The Image URL:   "http://normanmusicfestival.com/wp-content/uploads/2015/10/cloudnothings.jpg"
  //   2. The description: A bunch of paragraphs


  var $bandTag = $(".band-single", body),
      imageUrl = $(".band-content img", $bandTag).attr('src'),
      descriptionTags = $(".band-content p", body),
      socialLinks = $(".band-social li a",body)

  var description = "";

  console.log("descriptionTags = ", descriptionTags);

  $.each(descriptionTags, function(i, tag){
    console.log("trying tag",tag);
    if(i === 0 && $('img', tag).length){
      // skip this paragraph
      // we're already selecting the main image separately
      // this happens because the formatting on the main NMF site is inconsistent
      // sometimes the main image is inside .band-content, and sometimes it isn't
    }else{
      description += tag.outerHTML;
    }
  });

  band.imageUrl = imageUrl;
  band.description = description;
  band.socialLinks = socialLinks;

  //if (event.url.indexOf("item?id=") === 0) {
    //event.tag = event.tag || "Discuss";
    //event.url = `https://news.ycombinator.com/${event.url}`;
  //}

 
  // The second row looks something like this:
  //
  //  <td class="subtext">
  //    <span class="score" id="...">155 points</span>
  //    by <a href="...">joewalnes</a>
  //    <a href="...">3 hours ago</a> |
  //    <a href="...">30 comments</a>
  //  </td>
  //
  // We want to extract:
  //
  //   1. The number of points
  //   2. The number of comments
  //   3. The submitter username
  //   4. The submission time
  //
  // Everything besides jobs has all of these properties, so if we couldn't find
  // any of these, set the tag to "Job" and move on. For jobs, the "3 hours ago"
  // is not linked, so we have to be careful with the selectors.

  //var $points    = $(".subtext .score", row2),
      //$comments  = $(".subtext a:last-of-type", row2),
      //$submitter = $(".subtext a:first-of-type", row2),
      //submitted = $(".subtext", row2).text().trim();

  //if ($points.length > 0 && $comments.length > 0 && $submitter.length > 0) {
    //event.points    = toInt( $points.text() );
    //event.submitter = $submitter.text().trim();
    //event.submitted = extractSubmitted( submitted );
    //event.commentsCount = toInt( $comments.text() );
  //} else {
    //event.tag = "Job";
    //event.submitted = extractSubmitted( submitted );
  //}

  // Discussion threads like Ask HN has a body of text attached to them. We can
  // only get that if we are on the item page (as opposed to the index pages).
  //
  // The markup is a little strange, something like this:
  //
  //   <td>
  //     Hello!
  //     <p>Another line.</p>
  //     <p>Moar lines.</p>
  //   </td>
  //

  //if (row3) {
    //event.body = extractBody( $(row3).find("td:has(p)").contents() );
  //}

  // Obviously we will only have this if we are on the item page.

  //if (event.commentsCount !== null && commentRows) {
    //comments = extractComments(event, commentRows);
  //}

  return band;
}

export function extractSingle(doc) {
  console.log("000000000000000 starting extractSingle");
  var body = $("body", doc);

  var band = extractBand( body );
  console.log("11111111111111 extracted band", band);

  return { band };
}


export function isError(doc) {
  return $(".band-single", doc).length === 0;
}

export function parentID(doc) {
  return null; //extractID( $("body", doc).attr("class") );
}

