var args = arguments[0] || {};

function do_signup(){
	var win = Alloy.createController("auth/signup").getView();
	if(Ti.Platform.osname == "android"){
	  	win.open(); //{fullscreen:false, navBarHidden: false}
	}else{
		Alloy.Globals.navWin.openWindow(win,{animated:true});  
	} 
}

function onload(responseText){
	var result = JSON.parse(responseText); 
	if(result.status == "error"){
		Common.createAlert("Error", result.data[0]);
		loading.finish();
		return false;
	}else{
		loading.finish();
		var userModel = Alloy.createCollection('user'); 
		var arr = result.data; 
		userModel.saveArray(arr);
   		Ti.App.Properties.setString('user_id', arr.id);
   		Ti.App.Properties.setString('fullname', arr.fullname);
		var index = Alloy.createController("index");
		index.checkAuth();
	}
}

function do_login(){
	
	var username     = $.username.value;
	var password	 = $.password.value;
	if(username ==""){
		Common.createAlert("Fail","Please fill in your username");
		return false;
	}
	if(password =="" ){
		Common.createAlert("Fail","Please fill in your password");
		return false;
	}
	var params = { 
	 
		username: username,  
		password: password
	};
	//API.doLogin(params, $); 
	loading.start();
	API.callByPost({url: "doLoginUrl", params: params}, onload);
}

function init(){
	Alloy.Globals.navWin = $.navWin;
	var loading = Alloy.createController("loading");
	$.win.add(loading.getView());
}

init();

