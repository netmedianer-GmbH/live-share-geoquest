import { useState } from "react";
import { LiveShareProvider } from "@microsoft/live-share-react";
import { TestLiveShareHost } from "@microsoft/live-share";
import { LiveShareHost } from "@microsoft/teams-js";
import { inTeams } from "../utils";
import styles from "../styles/Stage.module.scss";
import { LiveShareContextProvider, StageWrapper } from "../components";

const IN_TEAMS = inTeams();


export const Stage = () => {
	const [host] = useState(IN_TEAMS ? LiveShareHost.create() : TestLiveShareHost.create());

	return (
		<div className={styles.stageCanvas}>
			<LiveShareProvider joinOnLoad host={host}>
				<LiveShareContextProvider>
					<StageWrapper />
				</LiveShareContextProvider>
			</LiveShareProvider>
		</div>
	);
};