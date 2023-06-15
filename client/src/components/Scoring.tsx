import React, { FunctionComponent, ReactNode, useContext, useEffect, useState } from "react";
import { Target32Regular } from "@fluentui/react-icons";
import { Map, Marker } from "pigeon-maps";
import styles from "../styles/Scoring.module.scss";
import { LiveGameContext, ILiveGameContext } from "./LiveShareContextProvider";
import { UserList } from "./UserList";
import { MapProvider } from "../utils/MapProvider";
import { ILiveGameUser, TeamsContext } from "../components";
import { DistanceHelper } from "../utils";
import { TTS } from "../utils/tts";

type ScoringProps = {
	// children: ReactNode,
};

export const Scoring: FunctionComponent<ScoringProps> = () => {
	const { question, userMap, tileProvider } = useContext(LiveGameContext) as ILiveGameContext;
	const { teamsContext } = useContext(TeamsContext);
	const ttsService = new TTS();
	const [ markers, setMarkers ] = useState<React.ReactNode>([]);

	useEffect(() => {
		const mrks: ReactNode[] = [];
		let winner: ILiveGameUser | undefined;
		userMap.forEach((user, key) => {
			if (!winner || winner.lastScore < user.lastScore) {
				winner = user;
			}
			if (user.position) {
				const colorMarker = (key === teamsContext?.user?.id) ? "var(--colorPaletteRedBackground3)" : "var(--colorNeutralForeground2)";
				const markerPosition: [number, number] = [user.position?.lat, user.position?.lng];
				mrks.push(<Marker key={key} anchor={markerPosition} color={colorMarker} />);
			}

		});

		if (question) {
			const targetPosition: [number, number] = [question.location.lat, question.location.lng];
			mrks.push(<Marker key={"target"} anchor={targetPosition} color="red">
				<div className={styles.targetMarker}><Target32Regular primaryFill="var(--colorPaletteRedBackground3)" /></div>
			</Marker>);
		}

		setMarkers(mrks);

		if (winner) {
			ttsService.announceRoundWinner(winner?.name || '');
		}
	}, []);

	return <div className={styles.scoringWrapper}>
		<div className={styles.scoringLeft}>
			<UserList showDistance={true} showScore={true} showLastScore={true} size="small" />
		</div>
		<div className={styles.scoringRight}>
			<Map
				provider={MapProvider.getTileProvider(tileProvider)}
				minZoom={2}
				attribution={MapProvider.getAttribution(tileProvider)}
				defaultZoom={2}>
				{markers}
			</Map>
		</div>
	</div>;
}