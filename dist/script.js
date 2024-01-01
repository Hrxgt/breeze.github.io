let currentSong = new Audio();
let songs;

 // extract songname by url

 function extractSongName(songUrl) {
    // Extract the portion between 'songs/' and '-'
    let name = songUrl.split('songs/')[1].split('-')[0];

    // Replace '%20' with space
    name = name.replaceAll('%20', ' ');

    return name;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60); // Round to the nearest whole second

    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    const formattedTime = `${minutes}:${formattedSeconds}`;
    return formattedTime;
}



async function getSongs() {
    let response = await fetch("/dist/songs");
    let textResponse = await response.text();
    let div = document.createElement('div');
    div.innerHTML = textResponse;
    let as = div.getElementsByTagName('a');
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href);
        }
    }
    return songs;
}

const playMusic = (track,songname)=>{

    currentSong.src = track
    currentSong.play()
    play.src="player.svg"
    document.querySelector('.songinfo').innerHTML=songname


}

async function main() {

     // list of songs
    songs = await getSongs();

    console.log(songs);

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    for (const song of songs) {
        let songn = song.split('songs/')[1]
        let songname = songn.split('-')[0]
        let artist = songn.split('-')[1]
        songUl.innerHTML += 
            `<li class="flex justify-between border border-gray-300 p-2 mb-2">
                <div class="flex space-x-2">
                    <img class="invert w-4" src="music.svg" alt="">
                    <div class="info text-xs space-y-1">
                        <div>${songname.replaceAll('%20',' ')}</div>
                        <div>${artist.replace('.mp3','').replaceAll('%20',' ')}</div>
                    </div>
                </div>
                <div class="playnow flex text-xs items-center space-x-1">
                    <div>Play</div>
                    <img class="invert w-4" src="playnow.svg" alt="">
                </div>
            </li>`;
    }


    // attach event listener to each song
    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {
            const songName = e.querySelector('.info').firstElementChild.innerHTML;
            const artist = e.querySelector('.info').lastElementChild.innerHTML;

            let songUrl = `http://127.0.0.1:5500/dist/songs/${songName}-${artist}.mp3`;
            console.log(songUrl);
            playMusic(songUrl,songName);
        });
    });

    // attach event listener to play next and previous
    play.addEventListener('click',()=>{
        if (currentSong.paused){
            currentSong.play()
            play.src="player.svg"
        }
        else{
            currentSong.pause()
            play.src = "pause.svg"
        }
    })

    // time update

    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector('.songtime').innerHTML= `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector('.circle').style.left = (currentSong.currentTime/currentSong.duration)*100+'%'
    })

    // adding event listner for seekbar

    document.querySelector('.seekbar').addEventListener('click',(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent +'%';
        currentSong.currentTime = (currentSong.duration)*percent/100
    })

    // event listner for hamburger

        // Add the event listeners for both click and touchstart events
    document.querySelector('.hamburger').addEventListener('click', toggleSidebar);
    document.querySelector('.hamburger').addEventListener('touchstart', toggleSidebar);

    document.querySelector('.close').addEventListener('click', closeSidebar);
    document.querySelector('.close').addEventListener('touchstart', closeSidebar);

    // Create separate functions for handling the events
    function toggleSidebar() {
        document.querySelector('.left').style.left = "0";
        document.querySelector('.left').style.position = "fixed";
        document.querySelector('.right').style.opacity = "0";
    }

    function closeSidebar() {
        document.querySelector('.left').style.left = "-100%";
        document.querySelector('.right').style.opacity = "100";
    }

    // extract songname by url

    function extractSongName(songUrl) {
        // Extract the portion between 'songs/' and '-'
        let name = songUrl.split('songs/')[1].split('-')[0];
        // Replace '%20' with space
        name = name.replaceAll('%20', ' ');  
        return name;
    }


    // event listner for back and next
    previous.addEventListener("click", () => {
        let current_index = (songs.indexOf(currentSong.src)) - 1; 
        if (current_index < 0) {
            current_index = songs.length - 1;
        }  
        newSong = songs[current_index];
        let name = extractSongName(newSong); 
        playMusic(newSong, name);

    });

    }
    next.addEventListener("click",()=>{
        let current_index = (songs.indexOf(currentSong.src)) + 1;
        if (current_index > songs.length) {
            current_index = 0;
        }
        newSong = songs[current_index];
        let name = extractSongName(newSong);
        playMusic(newSong, name);
    })




main();


  
