import capitals from "../assets/capitals.json"; // From: https://github.com/dinostheo/capitals.json/blob/master/capitals.json
import monuments from "../assets/monuments.json"; // From /generator

interface ICapital {
	"capital": string;
	"country": string;
	"location": {
		"lat": number;
		"lng": number;
	}
}

export interface IMonument {
	pageid: number;
	title: string;
	canonicalurl: string;
	coordinates: IMonumentCoordinates;
	pageImage: string;
}

export interface IMonumentCoordinates {
	lat: number;
	lon: number;
	primary: string;
	globe: string;
}

export interface IQuestion {
	question: string;
	imageUrl?: string;
	location: {
		lat: number;
		lng: number;
	}
}

export enum QuestionType {
	CAPITALS = "Capitals of the world",
	MONUMENTS = "Monuments of europe",
}

export class QuestionsHelper {

	public static getCapitalQuestion(): IQuestion {
		const capitalsList = capitals as ICapital[];
		const randomCapital = capitalsList[Math.floor(Math.random() * capitalsList.length)];

		return {
			question: (Math.random() < 0.5) ? `Find the capital of ${randomCapital.country} on the map.` : `Find ${randomCapital.capital} on the map.`,
			location: randomCapital.location,
		} as IQuestion;
	}

	public static getMonumentQuestion(): IQuestion {
		const monumentsList = monuments as IMonument[];
		const randomMonument = monumentsList[Math.floor(Math.random() * monumentsList.length)];

		return {
			question: `Find ${randomMonument.title} on the map.`,
			imageUrl: randomMonument.pageImage,
			location: {
				lat: randomMonument.coordinates.lat,
				lng: randomMonument.coordinates.lon,
			},
		} as IQuestion;
	}

	public static getQuestion(questionType: QuestionType): IQuestion {
		if (questionType === QuestionType.CAPITALS) {
			return QuestionsHelper.getCapitalQuestion();
		} else {
			return QuestionsHelper.getMonumentQuestion();
		}
	}
}