
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LiveShareProvider } from "@microsoft/live-share-react";
import { TestLiveShareHost } from "@microsoft/live-share";
import { LiveShareHost } from "@microsoft/teams-js";
import { inTeams } from "../utils";
import styles from "../styles/SidePanel.module.scss";
import { TeamsContext, GameSettings, LiveShareContextProvider } from "../components";

const IN_TEAMS = inTeams();


export const SidePanel = () => {
	const [host] = useState(IN_TEAMS ? LiveShareHost.create() : TestLiveShareHost.create());
	const { teamsContext } = useContext(TeamsContext);


	// Navigation fix when called in meeting stage
	const navigate = useNavigate();
	useEffect(() => {
		if (teamsContext?.page?.frameContext === "meetingStage") {
			navigate({
				pathname: "/stage",
				search: "?inTeams=true",
			});
		}
	}, [teamsContext, navigate]);


	return (
		<div className={styles.sidePanelWrapper}>
			<LiveShareProvider joinOnLoad host={host}>
				<LiveShareContextProvider>
					<GameSettings />
				</LiveShareContextProvider>
			</LiveShareProvider>
		</div>
	);
};