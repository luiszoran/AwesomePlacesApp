import { Component } from '@angular/core';
import { IonicPage, ModalController, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { Location } from "../../models/location";
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';
import { PlacesService } from "../../services/places";

declare var cordova: any;

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
        private camera: Camera, private file: File, private placesService: PlacesService,
        private viewController: ViewController) { }

    ionViewWillEnter() {
        this.viewController.setBackButtonText("Places");
    }

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
                const currentName = imageData.replace(/^.*[\\\/]/, '');
                const path = imageData.replace(/[^\/]*$/, '');
                const newFileName = new Date().getUTCMilliseconds() + ".jpg";
                this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
                    .then(
                    (data: Entry)=> {
                        this.imgUrl = data.nativeURL;
                        this.camera.cleanup();
                    })
                    .catch(
                    (err: FileError) => {
                        this.imgUrl = "";
                        const toast = this.toastController.create({
                            message: "Could not save the image. Please try again",
                            duration: 2500
                        });
                        toast.present();
                        this.camera.cleanup();
                    });
                this.imgUrl = imageData;
            })
            .catch(
              error => {
                  const toast = this.toastController.create({
                      message: "Could not take the image. Please try again",
                      duration: 2500
                  });
                  toast.present();
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
