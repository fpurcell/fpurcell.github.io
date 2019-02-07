# FlickrPhotoSwipe
Show Flickr images on a page rendered with the PhotoSwipe javascript library

Running:
 1. git clone https://github.com/fpurcell/FlickrPhotoSwipe.git
 1. cd FlickrPhotoSwipe
 1. run a simple webserver, ala python -m SimpleHTTPServer 8000
 1. http://localhost:8000/

Customizing:
 1. create a https://www.flickr.com/ account, add some images, make those images public
 1. create a Flickr 'Album', and add some photos to it...
 1  create a Flickr alias name https://www.flickr.com/profile_url.gne
 1. when you open your album in a browser, note the album id at the end of the url, 
    ala https://www.flickr.com/photos/lightbox111/albums/72157670059311695
 1. create a Flickr API id: https://www.flickr.com/services/api/
 1. cd FlickrPhotoSwipe
 1. edit file index.html
 1. change (at least) this line: var f = new FlickrPhotoSwipe("\<your api id\>", "\<your album id\>", "\<your flickr user id\>");
 1. look like this? FlickrPhotoSwipe("f795862b714e60d59e6b4585f902e563", "72157670059311695", "lightbox111");

