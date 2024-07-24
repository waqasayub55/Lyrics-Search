// Function to generate the Musixmatch API URL
function updateURL(songName = "", artistName = "") {
  return `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=jsonp&callback=searchLyrics&q_track=${songName}&q_artist=${artistName}&apikey=f90cd35582c176dbcfd3ecebcc227390`;
}

let submitButton = document.querySelector(".submit");
let closeCheckbox = document.getElementById("close-checkbox");

// Event listener for submit button click
submitButton.addEventListener("click", function() {
  let songName = document.querySelector(".song").value.replace(/ /g, "%20");
  let artistName = document.querySelector(".artist").value.replace(/ /g, "%20");
  let newURL = updateURL(songName, artistName);

  document.querySelector(".lyrics").textContent = "";
  updateScript(newURL);
  document.querySelector(".song").value = "";
  document.querySelector(".artist").value = "";
});

function updateScript(url) {
  let newScript = document.createElement("script");
  newScript.src = url;
  newScript.setAttribute("id", "head-script");

  let oldScript = document.getElementById("head-script");
  let head = document.getElementsByTagName("head")[0];

  if (oldScript === null) {
    head.appendChild(newScript);
  } else {
    head.replaceChild(newScript, oldScript);
  }
}

function searchLyrics(object) {
  const lyricsContainer = document.querySelector(".lyrics");

  if (object.message.header.status_code === 404) {
    lyricsContainer.textContent = "Lyrics not found";
  } else {
    lyricsContainer.textContent = object.message.body.lyrics.lyrics_body;
    showLyricsContainer();
  }
}

function showLyricsContainer() {
  const lyricsContainer = document.querySelector(".lyrics-container");

  if (!closeCheckbox.checked) {
    lyricsContainer.style.display = "block";
    document.body.style.height = "auto";
  } else {
    lyricsContainer.style.display = "none";
    document.body.style.height = "100vh";
  }
}

closeCheckbox.addEventListener("change", showLyricsContainer);

// Event listener for page load
window.addEventListener("load", function() {
  loadMostSearchedLyrics();
  loadNewlyAddedLyrics();
});

function loadMostSearchedLyrics() {
  const mostSearchedURL = "https://api.musixmatch.com/ws/1.1/chart.tracks.get?format=jsonp&callback=displayMostSearched&chart_name=top&page=1&page_size=5&apikey=f90cd35582c176dbcfd3ecebcc227390";
  const mostSearchedScript = document.createElement("script");
  mostSearchedScript.src = mostSearchedURL;
  document.head.appendChild(mostSearchedScript);
}

function displayMostSearched(data) {
  const mostSearchedList = document.querySelector(".most-searched-list");
  const tracks = data.message.body.track_list;

  if (!tracks || tracks.length === 0) {
    mostSearchedList.innerHTML = "<li>No most searched lyrics found.</li>";
    return;
  }

  tracks.forEach((track) => {
    const trackName = track.track.track_name;
    const artistName = track.track.artist_name;
    const listItem = document.createElement("li");
    listItem.textContent = `${trackName} by ${artistName}`;
    mostSearchedList.appendChild(listItem);
  });
}

function loadNewlyAddedLyrics() {
  const newlyAddedURL = "https://api.musixmatch.com/ws/1.1/chart.tracks.get?format=jsonp&callback=displayNewlyAdded&chart_name=new&page=1&page_size=5&apikey=f90cd35582c176dbcfd3ecebcc227390";
  const newlyAddedScript = document.createElement("script");
  newlyAddedScript.src = newlyAddedURL;
  document.head.appendChild(newlyAddedScript);
}

function displayNewlyAdded(data) {
  const newlyAddedList = document.querySelector(".newly-added-list");
  const tracks = data.message.body.track_list;

  if (!tracks || tracks.length === 0) {
    newlyAddedList.innerHTML = "<li>No newly added lyrics found.</li>";
    return;
  }

  tracks.forEach((track) => {
    const trackName = track.track.track_name;
    const artistName = track.track.artist_name;
    const listItem = document.createElement("li");
    listItem.textContent = `${trackName} by ${artistName}`;
    newlyAddedList.appendChild(listItem);
  });
}

const lyricsContainer = document.querySelector(".lyrics");
