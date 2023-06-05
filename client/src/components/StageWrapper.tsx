import { FunctionComponent, useContext } from "react"
import { AppGameState } from "../utils";
import { Countdown, Gaming, ILiveGameContext, LiveGameContext, Onboarding, Scoring } from ".";


type StageWrapperProps = {
	// children: ReactNode,
};

export const StageWrapper: FunctionComponent<StageWrapperProps> = () => {

	const { gameState } = useContext(LiveGameContext) as ILiveGameContext;

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