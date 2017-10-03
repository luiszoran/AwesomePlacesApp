import { Place } from "../models/place";
import { Location } from "../models/location";


export class PlacesService {
    private places: Place[] = [];

    addPlace(title: string, description: string, location: Location, imgUrl: string) {
        const place = new Place(title, description, location, imgUrl);
        this.places.push(place);
    }

    loadPlaces() {
        return this.places.slice();
    }

    deletePlace(index: number) {
        this.places.splice(index, 1);
    }
}