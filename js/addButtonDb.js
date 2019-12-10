function listenButtonMatch(){
    document.getElementById("addMatchToProfile").addEventListener("click", function(event) {
        console.log("test");
    });
}

function listenButtonTeam(){
    var buttonTeam = document.getElementById("addTeamToProfile");
    var teamDataPromise = getTeamsById();
    var urlParams = new URLSearchParams(window.location.search);
    var id = Number(urlParams.get("id"));
    var toggle = false;

    /*if (isDataExist(id)){
        toggle = true;
        console.log("data exist");
    } else {
        toggle = false;
        console.log("data not exist");
    }*/

    isDataExist(id).then(function(val){
        toggle = true;
        buttonTeam.innerHTML = "remove from favourite";
    }).catch(function(val){
        toggle = false;
        buttonTeam.innerHTML = "Add to profile";
    });


    document.getElementById("addTeamToProfile").addEventListener("click", function(event) {
        if (toggle){
            removeTeamFromFav(id);
            toggle = false;
            buttonTeam.innerHTML = "Add to profile";
        } else {
            teamDataPromise.then(function(data){
                addTeamToFav(data);
            });
            toggle = true;
            buttonTeam.innerHTML = "remove from favourite";
        }

    });
}