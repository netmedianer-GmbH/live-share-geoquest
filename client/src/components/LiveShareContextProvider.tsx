import { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ITimerConfig } from "@microsoft/live-share";
import { OnPauseTimerAction, OnPlayTimerAction, OnStartTimerAction, useLiveState, useLiveTimer, useSharedMap, useSharedState } from "@microsoft/live-share-react";
import { useLocalStorage } from "usehooks-ts";
import { AppGameState, TILE_PROVIDER, IQuestion } from "../utils";
import { TeamsContext } from ".";


// Create LiveGame context
export interface ILiveGameContext {
	gameState: { status: AppGameState };
	setGameState: (status: { status: AppGameState }) => void;
	userMap: ReadonlyMap<string, ILiveGameUser>;
	setUser: (key: string, value: ILiveGameUser) => void;
	currentUser?: ILiveGameUser;
	timerStart1: OnStartTimerAction;
	timerPause1: OnPauseTimerAction;
	timerPlay1: OnPlayTimerAction;
	timerMilliRemaining1: number;
	timerConfig1?: ITimerConfig;
	timerStart2: OnStartTimerAction;
	timerPause2: OnPauseTimerAction;
	timerPlay2: OnPlayTimerAction;
	timerMilliRemaining2: number;
	timerConfig2?: ITimerConfig;
	question?: IQuestion;
	setQuestion: (question?: IQuestion) => void;
	tileProvider: TILE_PROVIDER;
	setTileProvider: (tileProvider: TILE_PROVIDER) => void;
}

// Define LiveGame user
export interface IPosition {
	lat: number,
	lng: number,
}
export interface ILiveGameUser {
	name: string;
	score: number;
	position?: IPosition;
	positionSet?: boolean;
}


export const LiveGameContext = createContext<ILiveGameContext | undefined>(undefined);


type LiveShareContextProviderProps = {
	children: ReactNode,
};

export const LiveShareContextProvider: FunctionComponent<LiveShareContextProviderProps> = ({ children }) => {
	const { teamsContext } = useContext(TeamsContext);


	// Init LiveState GAME_STATE
	const INITIAL_STATE = { status: AppGameState.ONBOARDING };
	const [gameState, setGameState] = useLiveState("liveShareGeoQuestGameState", INITIAL_STATE);

	// Init SharedMap GAME_USERS
	const { map, setEntry } = useSharedMap<ILiveGameUser>("liveShareGeoQuestGameUsers");
	const [currentUser, setCurrentUser] = useState<ILiveGameUser>();
	useEffect(() => {
		const uid = teamsContext?.user?.id;
		if (uid && map.has(uid)) {
			const currentUser = map.get(uid) as ILiveGameUser;
			setCurrentUser(currentUser);
		}
	}, [map, teamsContext]);

	// Init LiveGame GAME_TIMER
	const { milliRemaining: milliRemaining1, timerConfig: timerConfig1, start: start1, pause: pause1, play: play1 } = useLiveTimer("liveShareGeoQuestGameTimer1");
	const { milliRemaining: milliRemaining2, timerConfig: timerConfig2, start: start2, pause: pause2, play: play2 } = useLiveTimer("liveShareGeoQuestGameTimer2");

	// Init LiveGame GAME_QUESTION
	const [question, setQuestion] = useSharedState<IQuestion | undefined>("liveShareGeoQuestGameQuestion", undefined);

	// Init LiveGame GAME_MAPPROVIDER, read from local storage for inital value
	const [persistedTileProvider] = useLocalStorage<string>("liveShareGeoQuestGameTileProvider", "WATERCOLOR_BACKGROUND");
	const [tileProvider, setTileProvider] = useLiveState<TILE_PROVIDER>("liveShareGeoQuestGameTileProvider", persistedTileProvider as TILE_PROVIDER);


	return <LiveGameContext.Provider value={{
		gameState,
		setGameState,
		userMap: map,
		setUser: setEntry,
		currentUser,
		timerStart1: start1,
		timerPause1: pause1,
		timerPlay1: play1,
		timerMilliRemaining1: milliRemaining1 || 0,
		timerConfig1,
		timerStart2: start2,
		timerPause2: pause2,
		timerPlay2: play2,
		timerMilliRemaining2: milliRemaining2 || 0,
		timerConfig2,
		question,
		setQuestion,
		tileProvider,
		setTileProvider
	}}>
		{children}
	</LiveGameContext.Provider>
};