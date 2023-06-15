import { FunctionComponent, useContext, useEffect } from "react"
import { AppGameState } from "../utils";
import { Countdown, Gaming, ILiveGameContext, LiveGameContext, Onboarding, Scoring } from ".";
import { TTS } from "../utils/tts";


type StageWrapperProps = {
	// children: ReactNode,
};

export const StageWrapper: FunctionComponent<StageWrapperProps> = () => {

	const { gameState, question } = useContext(LiveGameContext) as ILiveGameContext;
	const ttsService = new TTS();

	useEffect(() => {
		if (question && question.question && question.question.length) {
			ttsService.readQuestion(question.question);
		}
	}, [question]);

	return <>
		{(gameState.status === AppGameState.ONBOARDING) &&
			<Onboarding />
		}
		{/* {(gameState.status === AppGameState.PREPARING) &&
			<>
				<Preparation />
			</>
		} */}
		{(gameState.status === AppGameState.COUNTDOWN) &&
			<Countdown />
		}
		{(gameState.status === AppGameState.GAMING) &&
			<Gaming />
		}
		{(gameState.status === AppGameState.SCORING) &&
			<Scoring />
		}
	</>;
}