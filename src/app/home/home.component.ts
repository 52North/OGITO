import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  openProject(){
    console.log('add code to open a QGs Project');
  }
  showInfo(){
    //alert("Aqui se muestra la info");
    alert("Your screen dimensions are: " + screen.width + "x" + screen.height);
  }
  editSettings(){
    // Here you can edit the project to be display
    console.log('add code to edit settings, e.g., project to edit..');
  }
  exitToApp(){
    confirm("Exiting app");
  }
}
