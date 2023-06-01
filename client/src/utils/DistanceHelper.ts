import { IPosition } from "../components/LiveShareContextProvider";

export class DistanceHelper {
	// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
	public static getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const p = 0.017453292519943295;    // Math.PI / 180
		const c = Math.cos;
		const a = 0.5 - c((lat2 - lat1) * p) / 2 +
			c(lat1 * p) * c(lat2 * p) *
			(1 - c((lon2 - lon1) * p)) / 2;

		return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	}

	public static getPositionDistance(pos1: IPosition, pos2: IPosition): number {
		return DistanceHelper.getDistance(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
	}
}