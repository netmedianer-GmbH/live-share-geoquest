import { FunctionComponent, useContext } from "react"
import { AppGameState } from "../utils";
import { ILiveGameContext, LiveGameContext, Onboarding } from ".";
// import { Gaming } from "./Gaming";
// import { Preparation } from "./Preparation";
// import { Countdown } from "./Countdown";
// import { Scoring } from "./Scoring";

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
		}
		{(gameState.status === AppGameState.COUNTDOWN) &&
			<>
				<Countdown />
			</>
		}
		{(gameState.status === AppGameState.GAMING) &&
			<>
				<Gaming />
			</>
		}
		{(gameState.status === AppGameState.SCORING) &&
			<>
				<Scoring />
			</>
		} */}
	</>;
}