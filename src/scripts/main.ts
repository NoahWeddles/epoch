import "./player_data";
import "../input.css";
import hollow1 from "../hollow1.mp3";
import hollow2 from "../hollow2.mp3";
import hollow3 from "../hollow3.mp3";

interface Track {
    src: string;
    volume: number;
}

const tracks: Track[] = [
    { src: hollow1, volume: 0.1 },
    { src: hollow2, volume: 0.1 },
    { src: hollow3, volume: 0.008 },
];

let is_muted: boolean = localStorage.getItem("is_muted") ? JSON.parse(localStorage.getItem("is_muted")!) : false
localStorage.setItem("is_muted", JSON.stringify(is_muted))

document.querySelector(".mute")?.addEventListener("click",toggle_mute)



function main(): void {
    const nextTrack = tracks[Math.floor(Math.random() * tracks.length)];
    const audio = new Audio(nextTrack.src);
    playAudio(audio, nextTrack.volume);
}

let current_audio : HTMLAudioElement | null = null
let current_volume : number | null = null

function toggle_mute(){
    is_muted = !is_muted
    localStorage.setItem("is_muted", JSON.stringify(is_muted))

    if(!is_muted){
        unmute()
    }else{
        mute()
    }
}

function mute(){
    if (current_audio)
        current_audio.volume = 0
}

function unmute(){
    if (current_audio && current_volume)
        current_audio.volume = current_volume
}

function playAudio(audio: HTMLAudioElement, volume: number): void {
    current_audio = audio;
    current_volume = volume;
    audio.volume = is_muted ? 0 : volume;
    audio.play().catch(() => {
        window.addEventListener(
            "pointerdown",
            () => audio.play(),
            { once: true }
        );
    });

    audio.onended = () => {
        const nextTrack = tracks[Math.floor(Math.random() * tracks.length)];
        const nextAudio = new Audio(nextTrack.src);
        playAudio(nextAudio, nextTrack.volume);
    };
}


main();