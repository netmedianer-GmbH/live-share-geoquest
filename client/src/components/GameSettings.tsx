import { FunctionComponent, ReactNode, useContext, useEffect } from "react"
import { Button, Divider, Label, Select, Slider, useId } from "@fluentui/react-components";
import { ShareScreenStartRegular } from "@fluentui/react-icons";
import { meeting, SdkError } from "@microsoft/teams-js";
import { useLocalStorage } from "usehooks-ts";
import { LiveGameContext, ILiveGameContext, IPosition, ILiveGameUser } from "./LiveShareContextProvider";
import { DistanceHelper, TILE_PROVIDER, AppGameState, defaultPosition, QuestionType as QUESTION_TYPE, QuestionsHelper, countdownMillis, countdownGame } from "../utils";
import { UserList } from ".";
import styles from "../styles/GameSettings.module.scss";

type GameSettingsProps = {
	// children: ReactNode,
};

export const GameSettings: FunctionComponent<GameSettingsProps> = () => {
	const id = useId();
	const {
		gameState, setGameState,
		userMap, setUser,
		timerStart1,
		timerStart2,
		question, setQuestion,
		tileProvider, setTileProvider,
		currentRound, setCurrentRound,
		setNumberOfRounds } = useContext(LiveGameContext) as ILiveGameContext;
	const [, setPersistedTileProvider] = useLocalStorage<TILE_PROVIDER>("liveShareGeoQuestTileProvider", TILE_PROVIDER.WATERCOLOR_BACKGROUND);
	const [persistedQuestionType, setPersistedQuestionType] = useLocalStorage<QUESTION_TYPE>("liveShareGeoQuestQuestionType", QUESTION_TYPE.CAPITALS);
	const [persistedNumberOfRounds, setPersistedNumberOfRounds] = useLocalStorage<number>("liveShareGeoQuestNumberOfRounds", 5);


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

	const onGameResetBtn = () => {
		userMap.forEach((user, key) => {
			const updatedUser = { ...user, score: 0, positionSet: false, positionSetMillis: undefined } as ILiveGameUser;
			setUser(key, updatedUser);
		});
		setCurrentRound(0);
		setGameState({ status: AppGameState.ONBOARDING });
	};


	const onTileProviderChanged = (data: { value: string }) => {
		setPersistedTileProvider(data.value as TILE_PROVIDER);
		setTileProvider(data.value as TILE_PROVIDER);
	}

	const onQuestionTypeChanged = (data: { value: string }) => {
		setPersistedQuestionType(data.value as unknown as QUESTION_TYPE);
	}

	const onNumberOfRoundsChanged = (data: { value: number }) => {
		setPersistedNumberOfRounds(data.value);
		setNumberOfRounds(data.value);
	}


	// Statemachine
	useEffect(() => {
		let timer: number | undefined;

		if (gameState.status === AppGameState.COUNTDOWN) {
			setCurrentRound(currentRound + 1);

			const nextQuestion = QuestionsHelper.getQuestion(persistedQuestionType);
			setQuestion(nextQuestion);
			timerStart1(countdownMillis);

			userMap.forEach((user, key) => {
				const updatedUser = { ...user } as ILiveGameUser;
				updatedUser.positionSet = false;
				updatedUser.positionSetMillis = undefined;

				setUser(key, updatedUser);
			});

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
		<div className={styles.buttonGroup}>
			<Button
				className={styles.shareButton}
				size="large"
				icon={<ShareScreenStartRegular />}
				appearance="primary"
				onClick={onShareButtonClick}
			>Share app to stage</Button>
		</div>


		<Divider className={styles.gameSettingsDivider} appearance="brand">Game control - Round: {currentRound}</Divider>
		<div className={styles.buttonGroup}>
			<Button onClick={() => onGameControlBtn(AppGameState.ONBOARDING)} appearance={(gameState.status === AppGameState.ONBOARDING) ? "primary" : "outline"}>Onboarding</Button>
			<Button onClick={() => onGameControlBtn(AppGameState.COUNTDOWN)} appearance={(gameState.status === AppGameState.COUNTDOWN) ? "primary" : "outline"}>Start next round</Button>

			<div className={styles.spacer}></div>
			<Button onClick={() => onGameResetBtn()} appearance={"secondary"}>Reset game</Button>
		</div>


		<Divider className={styles.gameSettingsDivider} appearance="brand">Game settings</Divider>
		<div className={styles.gameSettingsSlider}>
			<Label htmlFor={id}>Number of rounds: {persistedNumberOfRounds}</Label>
			<Slider min={1} max={20} id={id} value={persistedNumberOfRounds} onChange={(_e, data) => onNumberOfRoundsChanged(data)} />
		</div>

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
		<UserList showScore={true} showDistance={true} showHasGuessed={false} size="extra-small" />
	</>;
}