console.log("scripting")
async function populateTracks(){
    console.log("attempting to populate")
    const res = await fetch("/api/tracks");
    const data = await res.json();
    console.log(JSON.stringify(data));
    var ul = document.getElementById("result-list")
    for (var i = 0; i < 20; i++) {
        var element = document.createElement("div")
        element.className = "element"
        var trackid = document.createElement("div")
        trackid.className = "number"
        var image = document.createElement("div")
        image.className = "image"
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
        element.appendChild(image)
        element.appendChild(title)
        element.appendChild(album)
        element.appendChild(artist)
        element.appendChild(duration)
        element.appendChild(add)

        ul.appendChild(element);
    }
}
populateTracks();