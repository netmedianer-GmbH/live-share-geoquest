import * as microsoftTeams from "@microsoft/teams-js";
import { Title2, Subtitle2 } from "@fluentui/react-components";
import styles from "../styles/Config.module.scss";
import { useRef, useEffect } from "react";
import { app } from "@microsoft/teams-js";

export const Config = () => {
	const isInitializing = useRef(false);

	useEffect(() => {
		const init = async () => {
			await app.initialize();
			microsoftTeams.pages.config.registerOnSaveHandler(function (saveEvent) {
				microsoftTeams.pages.config.setConfig({
					suggestedDisplayName: "GeoQuest",
					contentUrl: `${window.location.origin}/sidepanel?inTeams=true`,
				});
				saveEvent.notifySuccess();
			});

			microsoftTeams.app.notifySuccess();
			microsoftTeams.pages.config.setValidityState(true);
		}

		if (!isInitializing.current) {
			isInitializing.current = true;
			init();
		}
	}, []);

	return (
		<div className={styles.centerPage}>
			<Title2 block align="center">
				Welcome to live-share-geoquest!
			</Title2>
			<Subtitle2 block align="center">
				Press the save button to continue.
			</Subtitle2>
		</div>
	);
};