
/**
 * Modules dependencies.
 * @api private
 */

var peer = require('peer');
var signal = require('signal');
var video = require('video');
var opus = require('opus');

module.exports = function(servers) {

	// initialize peer with stun and turn servers

	hangout = peer(JSON.parse(servers));


	// start handshake when video is captured

	hangout.on('stream', function() {
		hangout.use(signal('hangout'));
	});


	// display remote video when added

	hangout.on('remote stream', function(stream) {
		var video = document.querySelector('.you');
		video.src = window.URL.createObjectURL(stream);
		video.play();
	});


	// settings

	hangout.codec(opus);
	hangout.use(video('.me'));

};

