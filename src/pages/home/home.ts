import { Component, OnInit } from '@angular/core';
import { IonicPage, ModalController, Platform } from 'ionic-angular';
import { Place } from "../../models/place";
import { PlacesService } from "../../services/places";

@IonicPage()
@Component({
    selector: 'home',
    templateUrl: 'home.html',
})
export class HomePage implements OnInit {
    places: Place[] = [];
    platforms: string[] = [];
    addPlacePage = "AddPlacePage";

    constructor(private placesService: PlacesService, private modalController: ModalController, private platform: Platform) { }

    ngOnInit() {
        this.platforms = this.platform.platforms();
        this.placesService.fetchPlaces().then(
            (places: Place[]) => {
                this.places = places;
            });
    }

    ionViewWillEnter() {
        this.places = this.placesService.loadPlaces();
    }

    onOpenPlace(place: Place, index: number) {
        const modal = this.modalController.create("PlacePage", { place: place, index: index });
        modal.present();
        modal.onDidDismiss(
            () => {
                this.places = this.placesService.loadPlaces();
            });
    }
}
