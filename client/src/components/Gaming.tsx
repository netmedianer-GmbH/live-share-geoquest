import { FunctionComponent, useCallback, useContext, useEffect, useState } from "react"
import { Map, Marker } from "pigeon-maps";
import styles from "../styles/Gaming.module.scss";
import { UserList, GameTimer } from ".";
import { LiveGameContext, ILiveGameContext, IPosition } from "./LiveShareContextProvider";
import { TeamsContext, ITeamsContext } from "./TeamsContextProvider";
import { countdownGame, defaultPosition } from "../utils/constants";
import { Subtitle2, Button } from "@fluentui/react-components";
import { MapProvider } from "../utils/MapProvider";

type GamingProps = {
	// children: ReactNode,
};

export const Gaming: FunctionComponent<GamingProps> = () => {
	const { teamsContext } = useContext(TeamsContext) as ITeamsContext;
	const { question, timerMilliRemaining2, currentUser, setUser, tileProvider, currentRound } = useContext(LiveGameContext) as ILiveGameContext;
	const [markerPosition, setMarkerPosition] = useState<[number, number]>(defaultPosition);

	useEffect(() => {
		onMapClicked({ latLng: defaultPosition });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	const onMapClicked = useCallback(({ latLng }: { latLng: [number, number] }) => {
		// Only allow position changes when position is not yet fixed.
		if (currentUser && teamsContext?.user?.id && !currentUser.positionSet) {
			setMarkerPosition(latLng);

			const newPosition: IPosition = { lat: latLng[0], lng: latLng[1] };
			const updatedUser = { ...currentUser };
			updatedUser.position = newPosition;

			setUser(teamsContext?.user?.id, updatedUser);
		} else {
			console.warn("Gaming.onMapClicked() - No currentUser was found.");
		}
	}, [currentUser, teamsContext, setUser]);


	const onGuessBtnClicked = () => {
		if (currentUser && teamsContext?.user?.id) {
			const millisElapsed = countdownGame - timerMilliRemaining2;
			const updatedUser = { ...currentUser };
			updatedUser.positionSet = true;
			updatedUser.positionSetMillis = millisElapsed;

			setUser(teamsContext?.user?.id, updatedUser);
		}
	};

	return <div className={styles.gamingCanvas}>
		<div className={styles.gamingHeader}>
			<GameTimer prefix={`Round: ${currentRound} - `} timerMilliRemaining={timerMilliRemaining2} />
			<div className={styles.gamingQuestion}>{question && <Subtitle2>Your task: {question.question}</Subtitle2>}</div>
		</div>
		<div className={styles.mapCanvas}>
			<div className={styles.gamingLeft}>
				<Button className={`${styles.guessButton} ${(!currentUser?.positionSet) ? styles.animated : ""}`} appearance="primary" onClick={() => onGuessBtnClicked()} disabled={currentUser?.positionSet}>Fix your guess</Button>
				<UserList showHasGuessed={true} size="small" />
			</div>
			<div className={styles.gamingRight}>
				<Map
					provider={MapProvider.getTileProvider(tileProvider)}
					attribution={MapProvider.getAttribution(tileProvider)}
					defaultZoom={2}
					onClick={onMapClicked}>
					{markerPosition && <Marker anchor={markerPosition} />}
				</Map>
			</div>
		</div>
	</div>;
}