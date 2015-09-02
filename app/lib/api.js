/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "salesad.freejini.com.my";

// APP authenticate user and key
var USER  = 'salesad';
var KEY   = '06b53047cf294f7207789ff5293ad2dc';

//API when app loading phase
var getCategoryList            = "http://"+API_DOMAIN+"/api/getCategoryList?user="+USER+"&key="+KEY;
var getFeaturedBanner   	   = "http://"+API_DOMAIN+"/api/getFeaturedBannerList?user="+USER+"&key="+KEY;
var getMerchantList			= "http://"+API_DOMAIN+"/api/getMerchantList?user="+USER+"&key="+KEY;
var getCategoryAds			= "http://"+API_DOMAIN+"/api/getCategoryAds?user="+USER+"&key="+KEY;
var getAdsList			= "http://"+API_DOMAIN+"/api/getAdsList?user="+USER+"&key="+KEY;
var getItemList			= "http://"+API_DOMAIN+"/api/getItemList?user="+USER+"&key="+KEY;

var getMerchantListByCategory  = "http://"+API_DOMAIN+"/api/getMerchantListByCategory?user="+USER+"&key="+KEY;
//API that call in sequence 
var APILoadingList = [
	{url: getCategoryList, model: "category", checkId: "5"},
	{url: getFeaturedBanner, model: "banners", checkId: "2"},
	{url: getMerchantList, model: "merchants", checkId: "6"},
	{url: getCategoryAds, model: "categoryAds", checkId: "7"},
	{url: getAdsList, model: "ads", checkId: "8"},
	{url: getItemList, model: "items", checkId: "9"},
];

/*********************
**** API FUNCTION*****
**********************/

// call API by post method
exports.callByPost = function(e, onload, onerror){
	var deviceToken = Ti.App.Properties.getString('deviceToken');
	if(deviceToken != ""){  
		var url = eval(e.url);
		var _result = contactServerByPost(url, e.params || {});   
		_result.onload = function(e) { 
			console.log('success');
			onload(this.responseText); 
		};
		
		_result.onerror = function(e) { 
			console.log("onerror");
			onerror();
		};
	}
};

exports.loadAPIBySequence = function (ex, counter){ 
	counter = (typeof counter == "undefined")?0:counter;
	if(counter >= APILoadingList.length){
		Ti.App.fireEvent('app:loadingViewFinish');
		return false;
	}
	
	var api = APILoadingList[counter];
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById(api['checkId']);
	var last_updated ="";
	
	//var model = Alloy.createCollection(api['model']);
	if(isUpdate != "" ){
		last_updated = isUpdate.updated;
	}
	  
	 var url = api['url']+"&last_updated="+last_updated;
	 console.log(url);
	 var _result = contactServerByGet(url);    
	 _result.onload = function(e) {  
	 	var res = JSON.parse(this.responseText);
	 	if(res.status == "Success" || res.status == "success"){
	 		/**load new set of category from API**/
	 		var arr = res.data;
	    	//	console.log(res);
	        //model.saveArray(arr);
	   	}
		Ti.App.fireEvent('app:update_loading_text', {text: APILoadingList[counter]['model']+" loading..."});
		checker.updateModule(APILoadingList[counter]['checkId'],APILoadingList[counter]['model'], COMMON.now());
			
		counter++;
		API.loadAPIBySequence(ex, counter);
	 };
	 
	 // function called when an error occurs, including a timeout
	 _result.onerror = function(e) { 
	 	console.log("API getCategoryList fail, skip sync with server");
	    API.loadAPIBySequence(ex, counter);
	 }; 
};


/*********************
 * Private function***
 *********************/
function contactServerByGet(url) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	client.open("GET", url);
	client.send(); 
	return client;
};

function contactServerByPost(url,records) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	if(OS_ANDROID){
	 	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
	 }
	client.open("POST", url);
	client.send({list: JSON.stringify(records)}); 
	return client;
};

function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};