import click from "../click.mp3"

interface Audio{
    src: string,
    volume: number,
    group: AudioGroup
}
enum AudioGroup{
    UI,
    GAME,
    MUSIC
}

const audios : Record<string, Audio> = {
    "click" : {
        src: click,
        volume: 1,
        group: AudioGroup.UI
    }
}

export function playAudio(id:string, pitch:number = 1){
    const audio = audios[id]
    const audioElement : HTMLAudioElement = new Audio(audio.src)
    audioElement.preservesPitch = false
    audioElement.playbackRate = pitch
    audioElement.play()
}