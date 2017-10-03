import { Component } from '@angular/core';
import { IonicPage, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { Location } from "../../models/location";
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { PlacesService } from "../../services/places";

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
    locationIsSet = false;
    imgUrl = "";

    constructor(private modalController: ModalController, private geolocation: Geolocation,
        private toastController: ToastController, private loadingController: LoadingController,
        private camera: Camera, private placesService: PlacesService) { }

    onOpenMap() {
        const modal = this.modalController.create("SetLocationPage", { location: this.location, isSet: this.locationIsSet });
        modal.present();
        modal.onDidDismiss(
            data => {
                if (!data) return;
                this.location = data.location;
                this.locationIsSet = true;
            }
        );
    }

    onLocate() {
        const loader = this.loadingController.create({
            content: "Getting your Location..."
        });
        loader.present();
        this.geolocation.getCurrentPosition()
            .then(
            location => {
                this.location.lat = location.coords.latitude;
                this.location.lng = location.coords.longitude;
                this.locationIsSet = true;
                loader.dismiss();
            })
            .catch(
            error => {
                loader.dismiss();
                const toast = this.toastController.create({
                    message: "Could not get location, please pick it manually",
                    duration: 2500
                });
                toast.present();

            });
    }

    onTakePhoto() {
        this.camera.getPicture({
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true
        })
            .then(
            imageData => {
                this.imgUrl = imageData;
            })
            .catch(
              error => {
                console.log(error);
            });
    }

    onSubmit(form: NgForm) {
        this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imgUrl);
        this.location = {
            lat: 40.7624324,
            lng: -73.9759827
        };
        form.reset();
        this.imgUrl = "";
        this.locationIsSet = false;
    }

}
