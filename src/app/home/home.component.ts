import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  showInfo(){
    //alert("Aqui se muestra la info");
    alert("Your screen dimensions are: " + screen.width + "x" + screen.height);
  }
  editSettings(){
    // Here you can edit the project to be display
    console.log('add code to edit settings, e.g., project to edit..');
  }
  handleLogin(){
    if(!this.auth.isLoggedIn()){
      this.auth.login()
    }else{
      const confirmed = confirm("Logging out, have all edits been saved?");
      if(confirmed){
        this.auth.logout();
      }
    }
  }
}
