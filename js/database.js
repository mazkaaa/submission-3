const dbName = "fooball_db";
const favTeam = "favTeam";

function databaseSetup(idb){
	var dbPromise = idb.open(dbName, 1, function(upgradeDb) {
		if (!upgradeDb.objectStoreNames.contains(favTeam)){
			var indexTeam = upgradeDb.createObjectStore(favTeam, {
				keyPath: "id"
			});
			indexTeam.createIndex("teamName", "name", {
				unique: false
			});
		}
	});
	return dbPromise;
}

function isDataExist(id){
	/*console.log("test");
	databaseSetup(idb).then(function(result){
		var tx = result.transaction(favTeam, "readonly");
		var store = tx.objectStore(favTeam);
		return store.get(id);
	}).then(function(result) {
		if (result == undefined){
			console.log("false");
			return false;
			
		} else {
			console.log("true");
			return true;
			
		}
	});*/

	return new Promise(function(resolve, reject){
		databaseSetup(idb).then(function(result){
			var tx = result.transaction(favTeam, "readonly");
			var store = tx.objectStore(favTeam);
			return store.get(id);
		}).then(function(result) {
			if (result == undefined){
				console.log("false");
				reject("data not exist");
				
			} else {
				console.log("true");
				resolve("data exist");
			}
		});
	});
}

function addTeamToFav(data){
	var teamData = {
		id: data.id,
		crestUrl: data.crestUrl,
		name: data.name,
		address: data.address,
		phone: data.phone,
		website: data.website,
		email: data.email
	};

	console.log(teamData);
	databaseSetup(idb).then(function(db) {
		var tx = db.transaction(favTeam, "readwrite");
		tx.objectStore(favTeam).put(teamData);
		return tx.complete;
	}).then(function() {
		alert("Data successfully favourited!");
		M.toast({html: 'Data successfully favourited!'})
	}).catch(function(){
		alert("Data failed favourited!");
		M.toast({html: 'Data failed favourited!'})
	});
}

function removeTeamFromFav(id){
	databaseSetup(idb).then(function(db) {
		var tx = db.transaction(favTeam, "readwrite");
		var store = tx.objectStore(favTeam);
		store.delete(id);
		return tx.complete;
	}).then(function(){
		alert("Successfully remove team from favourite!");
		M.toast({html: 'Successfully remove team from favourite!'})
	}).catch(function(){
		alert("Failed to remove team from favourite!");
		M.toast({html: 'Failed to remove team from favourite!'})
	});
}

function getTeamFavData(data){
	var favTeamCardHTML = "";
	data.forEach(function(team) {
		favTeamCardHTML += `
			<div class="col s12 m6 l6 xl6">
				<div class="card medium favCard center center-align">
					<img class="responsive-img favTeamLogo" src="${team.crestUrl}">
					<h4 class="truncate"><a href="./teamView.html?id=${team.id}">${team.name}</a></h4>
					<a href="./teamView.html?id=${team.id}" class="waves-effect waves-light btn mb25">view team</a>
				</div>
			</div>
		`;
	});
	document.getElementById("listFavTeam").innerHTML = favTeamCardHTML;
}

function loadTeamData(){
	console.log("test");
	getTeamData().then(function(res){
		getTeamFavData(res);
	});
	
}

function getTeamData(){
	return new Promise(function(resolve, reject) {
		databaseSetup(idb).then(function(result){
			var tx = result.transaction(favTeam, "readonly");
			var store = tx.objectStore(favTeam);
			return store.getAll();
		}).then(function(result) {
			resolve(result);
		});
	});
}

