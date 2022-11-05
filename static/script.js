async function populateTracks(){
    const res = await fetch("/api/tracks");
    const data = await res.json();
    var ul = document.getElementById("result-list")
    for (var i = 0; i < 1000; i++){
        var element = document.createElement("div")
        element.className = "element"
        var trackid = document.createElement("div")
        trackid.className = "number"
        trackid.id = data[i].track_id;
        var title = document.createElement("div")
        title.className = "titleE"
        title.id = data[i].track_title;
        var artist = document.createElement("div")
        artist.className = "artist"
        artist.id = data[i].artist_name;
        var album = document.createElement("div")
        album.className = "album"
        album.id = data[i].album_title;
        var duration = document.createElement("div")
        duration.className = "duration"
        var add = document.createElement("div")
        add.className = "add"
        var img = document.createElement("img")
        img.src = "addIcon.png"
        
        add.appendChild(img);
        trackid.appendChild(document.createTextNode(JSON.stringify(data[i].track_id).replaceAll('"','')))
        title.appendChild(document.createTextNode(JSON.stringify(data[i].track_title).replaceAll('"','')))
        artist.appendChild(document.createTextNode(JSON.stringify(data[i].artist_name).replaceAll('"','')))
        album.appendChild(document.createTextNode(JSON.stringify(data[i].album_title).replaceAll('"','')))
        duration.appendChild(document.createTextNode(JSON.stringify(data[i].track_duration).replaceAll('"','')))

        element.appendChild(trackid)
        element.appendChild(title)
        element.appendChild(album)
        element.appendChild(artist)
        element.appendChild(duration)
        element.appendChild(add)

        ul.appendChild(element);
        img.addEventListener("click", function(e){addTrack(e)});
    }
}
async function populatePlaylists(){
    const res = await fetch("/api/playlists");
    const data = await res.json();
    var playlistContent = document.getElementById('content-list');
    for (var i = 0 ; i < data.length; i++) {
        var playlistName = document.createElement('h3');
        var element = document.createElement('div');
        var contentHeader = document.createElement('div');
        var contentRow = document.createElement('div');
        var wrapper1 = document.createElement('div');
        var wrapper2 = document.createElement('div');
        var wrapper3 = document.createElement('div');
        var wrapper4 = document.createElement('div');
        var img = document.createElement("img")
        img.className = "sub"
        img.src = "subIcon.png"
        img.setAttribute("height", "15px");
        img.setAttribute("width", "15px");

        element.className = 'playlist-element';
        contentHeader.className = 'playlist-header-row';
        contentHeader.className = 'playlist-header-row';
        contentRow.className = 'playlist-content-row';
        wrapper1.className = 'wrapper1';
        wrapper1.id = 'trackDiv';
        wrapper2.className = 'wrapper2';
        wrapper3.className = 'wrapper3';
        wrapper3.id = data[i].playlist_id;
        wrapper4.className = 'wrapper4';

        playlistName.setAttribute('contentEditable', 'true');

        element.id = data[i]._id;
        playlistName.appendChild(document.createTextNode(data[i].playlist_name));
        var noTracks = document.createTextNode(`Tracks: ${data[i].no_of_tracks}`);
        var dur = document.createTextNode(`${data[i].total_duration}`);
        
        wrapper1.appendChild(noTracks);
        wrapper2.appendChild(dur);
        wrapper3.appendChild(playlistName);
        wrapper4.appendChild(img);
        contentHeader.appendChild(wrapper3);
        contentHeader.appendChild(wrapper4);
        contentRow.appendChild(wrapper2);
        contentRow.appendChild(wrapper1);
        element.appendChild(contentHeader);
        element.appendChild(contentRow);
        playlistContent.appendChild(element);

        img.addEventListener("click", function(e){removePlaylist(e)});
        element.addEventListener("click", function(e){selectPlaylist(e)});
        wrapper1.addEventListener("click", function(e){viewTracks(e)});
    }
}
populateTracks();
populatePlaylists();

document.getElementById('addPlaylist').addEventListener('click', 
    async function createPlaylists() {
        var id = await checkPlaylist();
        const noOfTracks = 0;
        const duration = '00:00';

        var playlistContent = document.getElementById('content-list');
        var playlistName = document.createElement('h3');
        var element = document.createElement('div');
        var contentHeader = document.createElement('div');
        var contentRow = document.createElement('div');
        var wrapper1 = document.createElement('div');
        var wrapper2 = document.createElement('div');
        var wrapper3 = document.createElement('div');
        var wrapper4 = document.createElement('div');
        var img = document.createElement("img")
        img.className = "sub"
        img.src = "subIcon.png"
        img.setAttribute("height", "15px");
        img.setAttribute("width", "15px");

        element.className = 'playlist-element';
        contentHeader.className = 'playlist-header-row';
        contentHeader.className = 'playlist-header-row';
        contentRow.className = 'playlist-content-row';
        wrapper1.className = 'wrapper1';
        wrapper1.id = 'trackDiv';
        wrapper2.className = 'wrapper2';
        wrapper3.className = 'wrapper3';
        wrapper3.id = id;
        wrapper4.className = 'wrapper4';

        playlistName.setAttribute('contentEditable', 'true');

        playlistName.appendChild(document.createTextNode(`Playlist #${id}`));
        var noTracks = document.createTextNode(`Tracks: ${noOfTracks}`);
        var dur = document.createTextNode(`${duration}`);
        
        wrapper1.appendChild(noTracks);
        wrapper2.appendChild(dur);
        wrapper3.appendChild(playlistName);
        wrapper4.appendChild(img);
        contentHeader.appendChild(wrapper3);
        contentHeader.appendChild(wrapper4);
        contentRow.appendChild(wrapper2);
        contentRow.appendChild(wrapper1);
        element.appendChild(contentHeader);
        element.appendChild(contentRow);
        playlistContent.appendChild(element);

        img.addEventListener("click", function(e){removePlaylist(e)})
        element.addEventListener("click", function(e){selectPlaylist(e)});
        wrapper1.addEventListener("click", function(e){viewTracks(e)});

        await fetch('/api/playlists', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                playlist_name : `Playlist #${id}`,
                playlist_id : id,
                no_of_tracks : noOfTracks,
                total_duration : duration,
                tracks : [],
            })
        });
});
async function checkPlaylist(){
    const res = await fetch("/api/playlists");
    const data = await res.json();
    var id = "1";
    if ((data.length != 0)){
        id = parseInt(data[data.length-1].playlist_id) + 1
    }
    return id;
}
function selectPlaylist(e){
    var data = [...document.getElementsByClassName("playlist-element selected")];
    data.map((x,i) => {
        data[i].className = "playlist-element"
        data[i].id = ""
    });
    if (e.target.className == "playlist-element" || e.target.className == "playlist-content-row") {
        e.target.className = "playlist-element selected";
        e.target.id = "selected";
    }
}
async function removePlaylist(e){
    var parent = e.target.parentElement.parentElement.parentElement
    var playlistContent = document.getElementById('content-list');
    playlistContent.innerHTML='';
    await fetch('/api/playlists', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            _id: parent.id,
        })
    });
    populatePlaylists();
}
async function addTrack(e){
    var playlist = document.getElementById("selected")
    if (playlist != null) {
        var parent = e.target.parentElement.parentElement
        await fetch('/api/playlists', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                playlist_id : playlist.children[0].children[0].id,
                track : parent.children[0].id,
            })
        });
    }
}

document.getElementById('getGenres').addEventListener("click", async function() {
    const res = await fetch("/api/genres");
    const data = await res.json();
    var result = "";
    data.map((x,i) => result += data[i].title+" ID: "+data[i].genre_id+" Parent: "+data[i].parent+", ");
    alert(result);
});

document.getElementById('addPlaylistField').addEventListener("keypress", function(event){addPlaylist(event)});
async function addPlaylist(event){
    if(event.key === "Enter"){
        var name = document.getElementById('addPlaylistField').value
        var id = await checkPlaylist();
        const noOfTracks = 0;
        const duration = '00:00';

        var playlistContent = document.getElementById('content-list');
        var playlistName = document.createElement('h3');
        var element = document.createElement('div');
        var contentHeader = document.createElement('div');
        var contentRow = document.createElement('div');
        var wrapper1 = document.createElement('div');
        var wrapper2 = document.createElement('div');
        var wrapper3 = document.createElement('div');
        var wrapper4 = document.createElement('div');
        var img = document.createElement("img")
        img.className = "sub"
        img.src = "subIcon.png"
        img.setAttribute("height", "15px");
        img.setAttribute("width", "15px");

        element.className = 'playlist-element';
        contentHeader.className = 'playlist-header-row';
        contentHeader.className = 'playlist-header-row';
        contentRow.className = 'playlist-content-row';
        wrapper1.className = 'wrapper1';
        wrapper1.id = 'trackDiv';
        wrapper2.className = 'wrapper2';
        wrapper3.className = 'wrapper3';
        wrapper3.id = id;
        wrapper4.className = 'wrapper4';

        playlistName.setAttribute('contentEditable', 'true');

        playlistName.appendChild(document.createTextNode(name));
        var noTracks = document.createTextNode(`Tracks: ${noOfTracks}`);
        var dur = document.createTextNode(`${duration}`);
        
        wrapper1.appendChild(noTracks);
        wrapper2.appendChild(dur);
        wrapper3.appendChild(playlistName);
        wrapper4.appendChild(img);
        contentHeader.appendChild(wrapper3);
        contentHeader.appendChild(wrapper4);
        contentRow.appendChild(wrapper2);
        contentRow.appendChild(wrapper1);
        element.appendChild(contentHeader);
        element.appendChild(contentRow);
        playlistContent.appendChild(element);

        img.addEventListener("click", function(e){removePlaylist(e)});
        element.addEventListener("click", function(e){selectPlaylist(e)});
        wrapper1.addEventListener("click", function(e){viewTracks(e)});

        await fetch('/api/playlists', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                playlist_name : name,
                playlist_id : id,
                no_of_tracks : noOfTracks,
                total_duration : duration,
                tracks : [],
            })
        });
        const res = await fetch("/api/playlists");
        const data = await res.json();
        for (var i = 0; i < data.length; i++) {
            if (data[i].playlist_id == id){
                element.id = data[i]._id;
            }
        }
        document.getElementById('addPlaylistField').value = '';
    }
};

async function viewTracks(e){
    var data = [...document.getElementsByClassName("wrapper1 selected")];
    data.map((x,i) => {
        data[i].className = "wrapper1"
    });
    if (e.target.className == "wrapper1") {
        e.target.className = "wrapper1 selected";
        var parentid = e.target.parentElement.parentElement.id;
        const res = await fetch(`/api/playlists/${parentid}`);
        const data = await res.json();
        const tracks = [...data.tracks];
        var ul = document.getElementById("result-list")
        ul.innerHTML = '';
        tracks.map((track,i)=>{
            var element = document.createElement("div")
            element.className = "element"
            var trackid = document.createElement("div")
            trackid.className = "number"
            trackid.id = data[i].track_id;
            var title = document.createElement("div")
            title.className = "titleE"
            var artist = document.createElement("div")
            artist.className = "artist"
            var album = document.createElement("div")
            album.className = "album"
            var duration = document.createElement("div")
            duration.className = "duration"
            var add = document.createElement("div")
            add.className = "add"
            var img = document.createElement("img")
            img.src = "addIcon.png"
            
            add.appendChild(img);
            trackid.appendChild(document.createTextNode(JSON.stringify(data[i].track_id).replaceAll('"','')))
            title.appendChild(document.createTextNode(JSON.stringify(data[i].track_title).replaceAll('"','')))
            artist.appendChild(document.createTextNode(JSON.stringify(data[i].artist_name).replaceAll('"','')))
            album.appendChild(document.createTextNode(JSON.stringify(data[i].album_title).replaceAll('"','')))
            duration.appendChild(document.createTextNode(JSON.stringify(data[i].track_duration).replaceAll('"','')))
    
            element.appendChild(trackid)
            element.appendChild(title)
            element.appendChild(album)
            element.appendChild(artist)
            element.appendChild(duration)
            element.appendChild(add)
    
            ul.appendChild(element);
        });

    }
}
document.getElementById('playlist-header').addEventListener('click',function(e) {clearSelected(e)});
function clearSelected(e){
    var data = [...document.getElementsByClassName("wrapper1 selected")];
    data.map((x,i) => {
        data[i].className = "wrapper1"
    });
    data = [...document.getElementsByClassName("playlist-element selected")];
    data.map((x,i) => {
        data[i].className = "playlist-element"
        data[i].id = ""
    });
    populateTracks();
}