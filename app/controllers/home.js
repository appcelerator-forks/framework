var args = arguments[0] || {};

//set source image width size equal to screen width
var pWidth = Titanium.Platform.displayCaps.platformWidth;
console.log(pWidth);

function cropImage(){	
	var croppedImage = $.crop.toImage();
	var imageView = Titanium.UI.createImageView({
	    image:croppedImage,
	    width: 200, height:200
	});
	$.container.add(imageView);
}
