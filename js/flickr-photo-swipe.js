/**
 * create HTML from the flickr api for photoswipe.js
 * NOTE: built using ES5 ... you might need https://github.com/es-shims/es5-shim to 
 *       make me work with old browsers (e.g., IE8).
 * @see https://kangax.github.io/compat-table/es6/
 */
class FlickrPhotoSwipe
{
    constructor(apiKey, albumId, userId)
    {
        this.apiKey = apiKey;
        this.albumId = albumId;
        this.userId = userId;
        FlickrPhotoSwipe.this_ = this; // singleton

        try {
            Code.PhotoSwipe.home_href = "http://flickr.com/" + this.userId;
        }catch(e) {
	    console.log("tried setting Code.PhotoSwipe.home_href ... a 3.0.4 version of the code");
        }
    }

    flickrUrl(msg)
    {
        var msg =  msg || "flickr.com/" + this.userId;
        var url = " <a href='http://www.flickr.com/" + this.userId + "' target='#'>" + msg + "</a> ";
        return url;
    }

    flickrLinkback(urlMsg, msg, cls)
    {
        var url = this.flickrUrl(urlMsg);
        var msg = msg || "";
        var cls = cls || "little";
        var lb = "<div class='" + cls + "'>" + msg + url + "</div>";
        return lb;
    }

    /** 
     * writes a script tag into your html to then pull an album from Flickr
     * NOTE: the jsonp callback in our request matches our static cb method above...
     */
    callFlickr()
    {
        var url = "<script type='text/javascript' language='javascript'" +
                  "src='https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos" +
                  "&api_key=" + this.apiKey +
                  "&photoset_id=" + this.albumId +
                  "&jsoncallback=FlickrPhotoSwipe._jsonFlickrApiCB" +
                  "&format=json&extras=original_format'></script>";
        console.log(url);
        document.writeln(url);
    }

    /** callback routine for jsonp call to the FlickrAPI */
    static _jsonFlickrApiCB(rsp)
    {
        // NOTE: this_ is the singleton object reference
        FlickrPhotoSwipe.this_._jsonFlickrApi(rsp);
        FlickrPhotoSwipe.this_._initPhotoSwipe(rsp); 
    }

    _initPhotoSwipe()
    {
	window.onload = function() {
	      setTimeout(function(){window.scrollTo(0, 2);}, 100);
	}
	(function(window, PhotoSwipe) {
	    document.addEventListener('DOMContentLoaded', function(){
	      var options = {},
		instance = PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), {minUserZoom: 1 } );
	      }, false);
	}(window, window.Code.PhotoSwipe));
    }

    /** 
     * this routine will grab image data from a Flickr album, and then write html for the static images and 
     * higher res links to the page 
     *
     * adapted from script written by Ajay at http://snarglr.com/about/ 
     * @see http://snarglr.com/s/2012/05/from-flickr-to-photoswipe/
     * @see http://stackoverflow.com/questions/8201168/photoswipe-get-images-from-flickr-or-other-feed 
     * @see https://twitter.com/PhotoSwipe
     */
    _jsonFlickrApi(rsp)
    {
        // makes sure everything's ok with FlickrAPI ... else return a link back to 
        if(rsp.stat != "ok")
        {
            var err = f.flickrLinkback(null, "I'm having trouble rendering my Flickr photos...please go there directly: ",  "error");
            document.writeln(err); 
            return;
        }

        // count number of responses
        var num = rsp.photoset.photo.length;

        // variables "r" + "s" contain markup generated by below loop
        // r=retina, s=standard
        var r = "";
        var s = "";

        // this loop runs through every item and creates HTML for either retina or standard
        // TODO: think about using getSizes to get each photo's size and then conditionally create URLs
        for(var i=0; i < num; i++)
        {
            var photo = rsp.photoset.photo[i];

            // create url for retina (o=original, bt=big thumb) and standard (st=standard thumb, so= flickr "large")
            var o_url  = 'http://farm'+ photo.farm +'.staticflickr.com/'  + photo.server +'/'+ photo.id +'_'+ photo.originalsecret +'_o.jpg';
            var bt_url = 'http://farm'+ photo.farm +'.static.flickr.com/' + photo.server +'/'+ photo.id +'_'+ photo.secret +'_q.jpg';
            var st_url = 'http://farm'+ photo.farm +'.static.flickr.com/' + photo.server +'/'+ photo.id +'_'+ photo.secret +'_s.jpg';
            //var so_url = 'http://farm'+ photo.farm +'.static.flickr.com/' + photo.server +'/'+ photo.id +'_'+ photo.secret +'_b.jpg';
            r += '<li><a href="'+ o_url +'"><img alt="'+ photo.title +'" src="'+ bt_url +'" title="Click to view '+ photo.title +' full size"/></a></li>';
            s += '<li><a href="'+ o_url +'"><img alt="'+ photo.title +'" src="'+ st_url +'" title="Click to view '+ photo.title +' full size"/></a></li>';
        }

        // detect retina vs. standard display, and show most appropo urls on the page
        var retina = window.devicePixelRatio > 1 ? true : false;
        if(retina)
        {
            var q = '<div id="MainContent"><ul id="Gallery" class="gallery">'+ r +' </ul></div>'
        }
        else
        {
            var q = '<div id="MainContent"><ul id="Gallery" class="gallery">'+ s +' </ul></div>'
        }

        // write list of photos back to the html page
        document.writeln(q); 
    }
}
