async function populateTracks(){
    const res = await fetch("/api/tracks");
    const data = await res.json();
    var ul = document.getElementById("result-list")
    for (var i = 0; i < 1000; i++){
        var element = document.createElement("div")
        element.className = "element"
        var trackid = document.createElement("div")
        trackid.className = "number"
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
    }
}
async function populatePlaylists(){
    const res = await fetch("/api/playlists");
    const data = await res.json();

    var playlistContent = document.getElementById('content-list');
    for (var i = 0 ; i < data.size; i++) {
        var playlistName = document.createElement('h3');
        var element = document.createElement('div');
        var contentHeader = document.createElement('div');
        var contentRow = document.createElement('div');
        var wrapper1 = document.createElement('div');
        var wrapper2 = document.createElement('div');

        element.className = 'playlist-element';
        contentHeader.className = 'playlist-header-row';
        contentHeader.className = 'playlist-header-row';
        contentRow.className = 'playlist-content-row';
        wrapper1.className = 'wrapper1';
        wrapper2.className = 'wrapper2';
        playlistName.setAttribute('contentEditable', 'true');

        element.id = data[i].playlist_id;
        playlistName.appendChild(document.createTextNode(`Playlist #${data[i].playlist_id}`));
        var noTracks = document.createTextNode(`Tracks: ${data[i].no_of_tracks}`);
        var dur = document.createTextNode(`${data[i].total_duration}`);

        contentHeader.appendChild(playlistName);
        wrapper1.appendChild(noTracks);
        wrapper2.appendChild(dur);
        contentRow.appendChild(wrapper2);
        contentRow.appendChild(wrapper1);
        element.appendChild(contentHeader);
        element.appendChild(contentRow);
        playlistContent.appendChild(element);
    }
}
populateTracks();
populatePlaylists();

document.getElementById('addPlaylist').addEventListener('click', 
    async function createPlaylists() {
        var id;
        const noOfTracks = 0;
        var duration = '00:00';
        
        id = await checkPlaylist()

        var playlistContent = document.getElementById('content-list');
        var playlistName = document.createElement('h3');
        var element = document.createElement('div');
        element.className = 'playlist-element';
        element.id = id;
        var contentHeader = document.createElement('div');
        contentHeader.className = 'playlist-header-row';
        var contentRow = document.createElement('div');
        contentRow.className = 'playlist-content-row';

        playlistName.setAttribute('contentEditable', 'true');
        playlistName.appendChild(document.createTextNode(`Playlist #${id}`));

        contentHeader.appendChild(playlistName);
        var noTracks = document.createTextNode(`Tracks: ${noOfTracks}`);
        var dur = document.createTextNode(`${duration}`);

        var wrapper1 = document.createElement('div');
        var wrapper2 = document.createElement('div');
        wrapper1.className = 'wrapper1';
        wrapper2.className = 'wrapper2';

        wrapper1.appendChild(noTracks);
        wrapper2.appendChild(dur);
        contentRow.appendChild(wrapper2);
        contentRow.appendChild(wrapper1);
        

        element.appendChild(contentHeader);
        element.appendChild(contentRow);
        playlistContent.appendChild(element);

        const response = await fetch('/api/playlists', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                playlistName : `Playlist #${id}`,
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
    var id = 1;
    console.log(data)
    if (!(JSON.stringify(data).size == undefined)){
        id = data[data.size].playlist_id + 1
    }
    return id;
}
