import { FunctionComponent, useCallback, useContext, useEffect, useState } from "react"
import { Map, Marker } from "pigeon-maps";
import styles from "../styles/Gaming.module.scss";
import { GameTimer } from "./GameTimer";
import { LiveGameContext, ILiveGameContext, IPosition } from "./LiveShareContextProvider";
import { TeamsContext, ITeamsContext } from "./TeamsContextProvider";
import { defaultPosition } from "../utils/constants";
import { Subtitle2 } from "@fluentui/react-components";
import { MapProvider } from "../utils/MapProvider";

type GamingProps = {
	// children: ReactNode,
};

export const Gaming: FunctionComponent<GamingProps> = () => {
	const { teamsContext } = useContext(TeamsContext) as ITeamsContext;
	const { question, timerMilliRemaining2, currentUser, setUser, tileProvider } = useContext(LiveGameContext) as ILiveGameContext;
	const [markerPosition, setMarkerPosition] = useState<[number, number]>(defaultPosition);

	useEffect(() => {
		onMapClicked({ latLng: defaultPosition });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	const onMapClicked = useCallback(({ latLng }: { latLng: [number, number] }) => {
		setMarkerPosition(latLng);

		if (currentUser && teamsContext?.user?.id) {
			const newPosition: IPosition = { lat: latLng[0], lng: latLng[1] };
			const updatedUser = { ...currentUser };
			updatedUser.position = newPosition;
			updatedUser.positionSet = true;

			setUser(teamsContext?.user?.id, updatedUser);
		} else {
			console.warn("Gaming.onMapClicked() - No currentUser was found.");
		}
	}, [currentUser, teamsContext, setUser]);



	return <div className={styles.gamingCanvas}>
		<div className={styles.gamingHeader}>
			<GameTimer timerMilliRemaining={timerMilliRemaining2} />
			{question && <Subtitle2>Your task: {question.question}</Subtitle2>}
		</div>
		<div className={styles.mapCanvas}>
			<Map
				provider={MapProvider.getTileProvider(tileProvider)}
				attribution={MapProvider.getAttribution(tileProvider)}
				defaultZoom={2}
				onClick={onMapClicked}>
				<Marker anchor={markerPosition} />
			</Map>
		</div>
	</div>;
}