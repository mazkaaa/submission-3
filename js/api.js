var api_url = "https://api.football-data.org/v2/";
var api_token = '0fdf2097c620444d98a4fa5379620413';
var api_url_standings = `${api_url}competitions/2002/standings?standingType=HOME`;
var api_url_teams = `${api_url}teams/`;
var api_url_match = `${api_url}competitions/2002/matches?status=SCHEDULED`;


// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
	if (response.status !== 200) {
		console.log("Error : " + response.status);
		// Method reject() akan membuat blok catch terpanggil
		return Promise.reject(new Error(response.statusText));
	} else {
	// Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
		return Promise.resolve(response);
	}
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
	return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
	// Parameter error berasal dari Promise.reject()
	console.log("Error : " + error);
}

const fetchApi = function(url){
	return fetch(url, {
		mode: "cors",
		headers: {
			"X-Auth-Token": api_token
		}
	})
}

function getStandingsJson(data){
	data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
	var standingsHTML = "";
	let rankNumber = 0;
	data.standings.slice(0, 10).forEach(function(standingsData){
		standingsData.table.slice(0, 10).forEach(function(teams){
			
			rankNumber++;
			standingsHTML += `
				<tr>
					<td>${rankNumber}</td>
					<td class="hide-on-med-and-down"><img class="teamLogo responsive-img" src="${teams.team.crestUrl}">
					<td><a href="./teamView.html?id=${teams.team.id}">${teams.team.name}</a></td>
					<td>${teams.playedGames}</td>
					<td>${teams.won}</td>
					<td>${teams.draw}</td>
					<td>${teams.lost}</td>
					<td>${teams.points}</td>
				</tr>
			`;
			
		});
		document.getElementById("standingsTable").innerHTML = standingsHTML;
	});
}

function getStandings(){
	if ("caches" in window){
		caches.match(api_url_standings).then(function(res){
			if (res) {
				res.json().then(function(data){
					getStandingsJson(data);
				});
			}
		});
	}
	fetchApi(api_url_standings).then(status).then(json).then(function(data) {
		getStandingsJson(data);
	}).catch(error);
}

function getMatch(){
	if ("caches" in window){
		caches.match(api_url_match).then(function(res){
			if (res){
				res.json().then(function(data){
					getMatchJson(data);
				});
			}
		});
	}
	fetchApi(api_url_match).then(status).then(json).then(function(data){
		getMatchJson(data);
	}).catch(error);
}

function getMatchJson(data){
	data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
	var matchHTML = "";
	data.matches.slice(0, 10).forEach(function(match){
		matchHTML += `
				<div class="col s12 m6 l6 xl6">
					<div class="card small match-card center center-align">
						<a href="./teamView.html?id=${match.homeTeam.id}" class="truncate"><h5>${match.homeTeam.name}</h5></a>
						<h6>VS</h6>
						<a href="./teamView.html?id=${match.awayTeam.id}" class="truncate"><h5>${match.awayTeam.name}</h5></a>
						<h6>Match day: ${match.matchday}</h6>
						<h6>${match.season.startDate}</h6>
					</div>
				</div>
			`;
			
		document.getElementById("match-card").innerHTML = matchHTML;
	});
}

function getTeamJson(data) {
	data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
	document.getElementById("team-emblem").src = data.crestUrl;
	document.getElementById("team-name").innerHTML = data.name;
	document.getElementById("team-address").innerHTML = data.address;
	document.getElementById("team-phone").innerHTML = data.phone;
	document.getElementById("team-website").innerHTML = data.website;
	document.getElementById("team-website-url").href = data.website;
	document.getElementById("team-email").innerHTML = data.email;
}

function getTeamsById(){
	return new Promise(function(resolve, reject){
		var urlParams = new URLSearchParams(window.location.search);
		var idParam = urlParams.get("id");
		var teamTableHTML = "";
		if ("caches" in window){
			caches.match(api_url_teams + idParam).then(function(res) {
				if (res){
					res.json().then(function(data) {
						getTeamJson(data);
						resolve(data);
					});
				}
			});
		}
		fetchApi(api_url_teams + idParam).then(status).then(json).then(function(data) {
			getTeamJson(data);
			resolve(data);
		}).catch(error);
	});
}