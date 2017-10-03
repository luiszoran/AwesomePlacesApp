import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { Place } from "../../models/place";
import { PlacesService } from "../../services/places";

@IonicPage()
@Component({
    selector: 'home',
    templateUrl: 'home.html',
})
export class HomePage {
    places: Place[] = [];
    addPlacePage = "AddPlacePage";

    constructor(private placesService: PlacesService, private modalController: ModalController) { }

    ionViewWillEnter() {
        this.places = this.placesService.loadPlaces();
    }

    onOpenPlace(place: Place, index: number) {
        const modal = this.modalController.create("PlacePage", { place: place, index: index });
        modal.present();
    }
}
