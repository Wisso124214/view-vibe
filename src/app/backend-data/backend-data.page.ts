import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Device } from '@capacitor/device';

async function getIdDevice() {
  const id = await Device.getId();
  return id;
}

@Component({
  selector: 'app-backend-data',
  templateUrl: './backend-data.page.html',
  styleUrls: ['./backend-data.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class BackendDataPage implements OnInit {

  constructor() { }

  id: any;

  ngOnInit() {
    getIdDevice().then((id) => {
      console.log(id.identifier)
      this.id = id.identifier;
    });
  }

}
