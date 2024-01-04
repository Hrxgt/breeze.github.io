let currentSong = new Audio();
let songs;
let currFolder;
let songname;
let artist;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
} 


async function getSongs(folder='ncs') {
    currFolder = folder;
    const baseUrl = 'https://hrxgt.github.io/breeze.github.io';
    let a = await fetch(`${baseUrl}/dist/songs/${folder}/`);

    // let a = await fetch(`songs/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    console.log(songs)
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
   
    for (const song of songs) {
        songname = song.split('-')[0].replaceAll('%20',' ')
        artist = song.split('-')[1].replace('.mp3','').replaceAll('%20','') 
        songUL.innerHTML = songUL.innerHTML + `<li class="flex  justify-between">
        <div class="flex space-x-2 ">
            <img class="invert w-4 " src="music.svg" alt="">
            <div class="info text-xs space-y-1">
                <div class='src' >${song.replace("%20", " ")}</div>
                <div>${songname}</div>
                <div>${artist}</div>
             
            </div>
        </div>
        <div class="playnow flex text-xs items-center space-x-1">
            <div>Play</div>
            <img class="invert w-4" src="playnow.svg" alt="">
        </div>
       
    </li>`;
    }
      // Attach an event listener to each song
     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let address = (e.querySelector(".info").firstElementChild.innerHTML.trim()).replaceAll(' ','%20')
            console.log(address)
            let url = `songs/${currFolder}/${address}`
            console.log(url)
            playMusic(url)

        })
    })  
    return songs
}

//  Play Music function

const playMusic = (track,pause = false) => {
    currentSong.src = track; 
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = currentSong.src.split('/')[6].replaceAll('%20',' ').split('-')[0];
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.png"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

     // Add an event listener to seekbar
     document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
     
     // Add an event listener for hamburger
     document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    
     // Add an event listener for close button
     document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

   

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1])
        if(index <= 0){
            index = songs.length 
        }
        let newsong = songs[index-1]
        console.log(newsong)
        let url = `songs/${currFolder}/${newsong}`
        playMusic(url)
    })

     // Add an event listener to next
     next.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1])
        if(index >= songs.length-1 ){
            index = -1 
        }
        let newsong = songs[index+1]
        console.log(newsong)
        let url = `songs/${currFolder}/${newsong}`
        playMusic(url)
    })

}

async function displayAlbum(){
    home.addEventListener('click',()=>{
        getSongs()
    })
    
    card1.addEventListener('click',()=>{
        getSongs('arijit')
    })
    card2.addEventListener('click',()=>{
        getSongs('rahat')
    })
    card3.addEventListener('click',()=>{
        getSongs('sonu')
    })
    
    card4.addEventListener('click',()=>{
        getSongs('kishore')
    })
    
    card5.addEventListener('click',()=>{
        getSongs('jubin')
    })
    

}

displayAlbum()

getSongs()
main()