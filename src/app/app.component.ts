import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'OGITO';


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key === 'F11'){
      console.log("hit f11")
      event.preventDefault()
      if(!document.fullscreenElement) {
        document.getElementById("app-content-container").focus()
        document.getElementById("app-content-container").requestFullscreen()
      }else{
        document.exitFullscreen()
      }
    }
  }

}
