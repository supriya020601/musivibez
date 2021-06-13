import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable,Observer } from 'rxjs';
import { SongsService } from '../songs.service';

@Component({
  selector: 'app-tsongs',
  templateUrl: './tsongs.component.html',
  styleUrls: ['./tsongs.component.css']
})
export class TsongsComponent implements OnInit {
 
  songs:any;
  audioObj=new Audio();
  audioEvents=[
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeUpdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ]
  currenttime="00:00:00";
  duration="00:00:00";
  seek=0
 

  streamObserver(audio){
    return new Observable(observer =>{
      this.audioObj.src=audio;
      this.audioObj.load();
      this.audioObj.play()

      const handler=(event:Event)=>{
        this.seek=this.audioObj.currentTime;
        this.currenttime=this.timeFormat(this.audioObj.currentTime);
        this.duration=this.timeFormat(this.audioObj.duration)
      }
      this.addEvent(this.audioObj, this.audioEvents, handler)
      return () =>{
        this.audioObj.currentTime=0;
       
      }
    });
  }
  addEvent(obj,events,handler){
    events.forEach(event =>{
      obj.addEventListener(event,handler);
    })
  }
  removeEvent(obj,events,handler){
    
  }
  constructor(private ar:ActivatedRoute, private tObj:SongsService) { }

  ngOnInit(): void {
    let id=this.ar.snapshot.params.id;
    this.tObj.getTeluguSongsById(id).subscribe(
      sdata=>{
        this.songs=sdata;
      },
      err=>{
        console.log('error in loading data',err)
      }
    )
  }


  setVolume(ev){
    this.audioObj.volume = ev.target.value
  }
  openSong(audio){
    this.streamObserver(audio).subscribe(event=>{});
  }

  play(){
    this.audioObj.play();
  }
  pause(){
    this.audioObj.pause();

  }
  stop(){
    this.audioObj.pause();
    this.audioObj.currentTime=0;
  }

  timeFormat(time,format="HH:mm:ss"){
    const momentTime = time*1000;
    return moment.utc(momentTime).format(format);

  }
  
}

