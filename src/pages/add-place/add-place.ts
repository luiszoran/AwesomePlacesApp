import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { Location } from "../../models/location";

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

    location: Location = {
        lat: 40.7624324,
        lng: -73.9759827
    };

    constructor(private modalController: ModalController) {

    }

    onOpenMap() {
        const modal = this.modalController.create("SetLocationPage", { location: this.location });
        modal.present();
    }

}
