import { countdownGame } from ".";

export interface IResult {
	key: string;
	distance: number;
	positionSetMillis: number;
	points: number | undefined;
}

export class ScoreHelper {
	public static calculateScores(results: IResult[]): IResult[] {
		const maxDistance = Math.max(...results.map(o => o.distance));
		const maxDurationMillis = Math.max(...results.map(o => o.positionSetMillis));

		const maxPointsDistance = 750;
		const maxPointsDuration = 250;

		return results.map(result => {
			// Calculate Distance points (max. maxPointsDistance if direct hit)
			// If you have the max distance, you get 0 points, the other according to distance
			let distancePoints = 0;
			if (maxDistance > 0 && result.distance > 0) {
				distancePoints = maxPointsDistance - ((result.distance / maxDistance) * maxPointsDistance);
				// console.log("POINTS DISTANCE USER", distancePoints, result);
			}

			// Same for duration (max. maxPointsDuration if it took you no time, 0 points if you needed the max time)
			let durationPoints = 0;
			if (maxDurationMillis > 0 && result.positionSetMillis > 0) {
				durationPoints = maxPointsDuration - ((result.positionSetMillis / countdownGame) * maxPointsDuration);
				// console.log("POINTS DURATION USER", durationPoints, result);
			}

			result.points = distancePoints + durationPoints;
			return result;
		});
	}
}