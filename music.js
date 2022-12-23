

const prevBtn = document.getElementById('prev'); 
const nextBtn = document.getElementById('next'); 
const playBtn  = document.getElementById('play'); 
const volume  = document.getElementById('volume'); 
const audio  = document.getElementById('audio'); 
const volumeSetter = document.getElementById('volumeSetter');
const preText = document.getElementById('text') ; 
const linkBtn = document.getElementById('link'); 
let randomIndex = 0; 

let musicArray = [  'music/Alan Walker & UPSAHL - Shut Up (Official Music Video)_1sESCIMpx0U.mp3', 
                    "music/Alan Walker & Sorana - Catch Me If You Can (Offical Lyric Video)_MsRYa6UWzAo.mp3", 
                    "music/Alan Walker x @Conor Maynard - Believers (Official Montage)_ZtBzWUZbTvA.mp3", 
                    "music/Legends Never Die_ Remix (ft. Alan Walker) _ Worlds 2017 - League of Legends_eEKfWVvADiQ.mp3",
                    "music/Alan Walker - Lovesick (Official Lyric Video)_9AFqO114Xq4.mp3",
                    "music/Alan Walker - Ritual (Official Music Video)_-W8UizbMJbc.mp3" , 
                    "music/Sam.mp3", 
                    "music/GIMS.mp3", 
                    "music/death.mp3", 
                    "music/GAZO-x-Freeze-Corleone-667-DRILL-FR-4_lbeUyW6axeA.mp3", 
                    "music/Freeze-Ral__Zey1wgfA-c.mp3", 
                    "music/KOBA-LAD-7-SUR-7-FT-FREEZE-CORLEONE-CLIP-OFFICIEL_tr2zDYYKLMM.mp3", 
                    "music/Freeze-Corleone-Rip-Pop-Smoke-REMIX-Welcome-to-the-party-freestyle_V0xS-0ykSYM.mp3",
                    "music/Freeze-Corleone-667-Welcome-to-the-party-freestyle_MvNbC9xZb-o.mp3",
                    "music/Freeze-Corleone-667-Hors-Ligne_JXYNYzaGIns.mp3",
                    "music/Freeze-Corleone-667-feat-Central-Cee-Polmique_xVjzNyydTfM.mp3", 
                    "music/Freeze-Corleone-667-feat-Ashe22-Cartier_NREvaS5qzyE.mp3", 
                    "music/Freeze-Corleone-667-feat-Ashe-22-Scell-Part-2_VPRaqAKK5qk.mp3",
                    "music/ASHE-22-SCELLE-PART-3-FEAT-FREEZE-CORLEONE_EYuAnYXl6Xg.mp3", 
                    "music/Amine-Farsi-x-Freeze-Corleone-667-FRAUDE-Clip-Officiel_yH2Pz_fCLf4.mp3", 
                    "music/ASHE-22-feat-Freeze-Corleone-667-DGRAD_XdkEkbviqHk.mp3"
                    
] 

loadSong(randomIndex)

const displayLinkBtn = () => {
    linkBtn.style.display = 'block'; 
    linkBtn.style.opacity = '1'
}

setTimeout(displayLinkBtn, 4000); 

function loadSong(randomIndex) {
   
    audio.src = musicArray[randomIndex]; 
}

function playSong() {
    playBtn.querySelector('i.fa-solid').classList.remove('fa-play'); 
    playBtn.querySelector('i.fa-solid').classList.add('fa-pause'); 

    audio.play(); 
}



function pauseSong() {
    playBtn.querySelector('i.fa-solid').classList.remove('fa-pause'); 
    playBtn.querySelector('i.fa-solid').classList.add('fa-play'); 

    audio.pause(); 
}

function prevSong() {
    randomIndex--;  
    if(randomIndex < 0 ) {
        randomIndex = musicArray.length-1; 
        
    }
   loadSong(randomIndex)
   playSong()
}

function nextSong() {
    randomIndex++;  
    if(randomIndex > musicArray.length-1) {
        randomIndex = 0; 
        
    }
   loadSong(randomIndex); 
   playSong()
}


function setVolume (volume) {
    audio.volume = volume; 
    console.log(audio.volume); 
}

// function updateProgress(e) {
//     const {duration, currentTime} = e.srcElement; 
//     const progressPercent = (currentTime/duration)*100;
//     progress.style.width = `${progressPercent}%`

// }

playBtn.addEventListener('click', ()=> {
    console.log(audio.paused)
    if(audio.paused) {
    
        playSong()
    }
    else {
        pauseSong(); 
    }
})

prevBtn.addEventListener('click', prevSong); 
nextBtn.addEventListener('click', nextSong);
volumeSetter.addEventListener('input', ()=> setVolume(volumeSetter.value))

//-------Now the autowrite text part----------------//
// var i = 0;
// var txt = 'Hi! My Name is Max and this is my Graph Algorithm Project!';
// var speed = 70;

// function typeWriter() {
//   if (i < txt.length) {
//    preText.innerHTML += txt.charAt(i);
//     i++;
//     setTimeout(typeWriter, speed);
//   }
// }

// typeWriter()


