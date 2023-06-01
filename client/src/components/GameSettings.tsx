import { FunctionComponent, ReactNode, useContext, useEffect } from "react"
import { Button, Divider, Select } from "@fluentui/react-components";
import { AppGameState, defaultPosition } from "../utils/constants";
import { LiveGameContext, ILiveGameContext, IPosition, ILiveGameUser } from "./LiveShareContextProvider";
import { QuestionType as QUESTION_TYPE, QuestionsHelper } from "../utils/QuestionsHelper";
import { DistanceHelper } from "../utils";
// import { UserList } from "./UserList";
import styles from "../styles/GameSettings.module.scss";
import { TILE_PROVIDER } from "../utils/MapProvider";
import { useLocalStorage } from "usehooks-ts";
import { ShareScreenStartRegular } from "@fluentui/react-icons";
import { meeting, SdkError } from "@microsoft/teams-js";

type GameSettingsProps = {
	// children: ReactNode,
};

export const GameSettings: FunctionComponent<GameSettingsProps> = () => {
	const { gameState, setGameState, userMap, setQuestion, timerStart1, timerStart2, question, setUser, tileProvider, setTileProvider } = useContext(LiveGameContext) as ILiveGameContext;
	const [, setPersistedTileProvider] = useLocalStorage<TILE_PROVIDER>("spotalotTileProvider", TILE_PROVIDER.WATERCOLOR_BACKGROUND);
	const [persistedQuestionType, setPersistedQuestionType] = useLocalStorage<QUESTION_TYPE>("spotalotQuestionType", QUESTION_TYPE.CAPITALS);


	// Share Button
	const onShareButtonClick = () => {
		meeting.shareAppContentToStage(
			(error: SdkError | null) => {
				if (error) {
					console.error("::: ERROR when doing shareAppContentToStage()", error);
				}
			},
			`${window.location.origin}/stage?inTeams=true`
		);
	};

	// Game control
	const onGameControlBtn = (nextState: AppGameState) => {
		setGameState({
			status: nextState,
		});
	};

	const onScoreResetBtn = () => {
		userMap.forEach((user, key) => {
			const updatedUser = { ...user, score: 0 } as ILiveGameUser;
			setUser(key, updatedUser);
		});
	};


	const onTileProviderChanged = (data: { value: string }) => {
		setPersistedTileProvider(data.value as TILE_PROVIDER);
		setTileProvider(data.value as TILE_PROVIDER);
	}

	const onQuestionTypeChanged = (data: { value: string }) => {
		setPersistedQuestionType(data.value as unknown as QUESTION_TYPE);
	}


	const countdownMillis = 10000;
	const countdownGame = 30000;
	// Statemachine
	useEffect(() => {
		let timer: number | undefined;

		if (gameState.status === AppGameState.PREPARING) {
			setQuestion();
		}

		if (gameState.status === AppGameState.COUNTDOWN) {
			const nextQuestion = QuestionsHelper.getMonumentQuestion();
			setQuestion(nextQuestion);
			timerStart1(countdownMillis);

			timer = setTimeout(() => {
				setGameState({ status: AppGameState.GAMING });
			}, countdownMillis);
		}

		if (gameState.status === AppGameState.GAMING) {
			timerStart2(countdownGame);
			timer = setTimeout(() => {
				setGameState({ status: AppGameState.SCORING });
			}, countdownGame);
		}

		if (gameState.status === AppGameState.SCORING) {
			if (question) {
				userMap.forEach((user, key) => {
					const guessedPosition: IPosition = (user.position) ? user.position : {
						lat: defaultPosition[0],
						lng: defaultPosition[1],
					};
					const distance = DistanceHelper.getPositionDistance(guessedPosition, question.location);

					const updatedUser = { ...user } as ILiveGameUser;
					updatedUser.score = (updatedUser.score || 0) + distance;

					setUser(key, updatedUser);
				});
			}
		}

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameState.status, setGameState, setQuestion, timerStart1, timerStart2, setUser]);


	const users: ReactNode[] = [];
	userMap.forEach(user => {
		const distance = (user.position && question) ? `${DistanceHelper.getPositionDistance(user.position, question.location).toFixed(2)} km` : "---";
		users.push(<div>{user.score} - {user.name} - {distance}</div>);
	});

	const tileProviders = Object.entries(TILE_PROVIDER).map(([key, value]) => ({ key, value }));
	const questionTypes = Object.entries(QUESTION_TYPE).map(([key, value]) => ({ key, value }));

	return <>
		<Button
			className={styles.shareButton}
			size="large"
			icon={<ShareScreenStartRegular />}
			appearance="primary"
			onClick={onShareButtonClick}
		>Share app to stage</Button>

		<Divider className={styles.gameSettingsDivider} appearance="brand">Game control</Divider>
		<Button onClick={() => onGameControlBtn(AppGameState.ONBOARDING)} appearance={(gameState.status === AppGameState.ONBOARDING) ? "primary" : "outline"}>Onboarding</Button>
		<Button onClick={() => onGameControlBtn(AppGameState.PREPARING)} appearance={(gameState.status === AppGameState.PREPARING) ? "primary" : "outline"}>Pre-round</Button>

		<Button
			onClick={() => onGameControlBtn(AppGameState.COUNTDOWN)}
			appearance={(gameState.status === AppGameState.COUNTDOWN || gameState.status === AppGameState.GAMING) ? "primary" : "outline"}
			disabled={!(gameState.status === AppGameState.PREPARING || gameState.status === AppGameState.SCORING)}
		>Start next round</Button>

		<Button onClick={() => onGameControlBtn(AppGameState.SCORING)} appearance={(gameState.status === AppGameState.SCORING) ? "primary" : "outline"}>Scoring</Button>

		<div className={styles.spacer}></div>
		<Button onClick={() => onScoreResetBtn()} appearance={"secondary"}>Reset scores</Button>


		<Divider className={styles.gameSettingsDivider} appearance="brand">Game settings</Divider>
		<Select value={tileProvider} onChange={(_e, data) => onTileProviderChanged(data)}>
			{tileProviders.map(p => {
				return <option key={p.key} value={p.key}>{p.value}</option>;
			})}
		</Select>
		<div className={styles.spacer}></div>
		<Select value={persistedQuestionType} onChange={(_e, data) => onQuestionTypeChanged(data)}>
			{questionTypes.map(p => {
				return <option key={p.key} value={p.key}>{p.value}</option>;
			})}
		</Select>

		<Divider className={styles.gameSettingsDivider} appearance="brand">Users</Divider>
		{/* <UserList showScore={true} showDistance={true} size="extra-small" /> */}
	</>;
}