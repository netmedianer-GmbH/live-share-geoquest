import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { app } from "@microsoft/teams-js";
import { inTeams } from './utils';
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
import styles from "./styles/App.module.scss";
import { TeamsContextProvider } from './components';
import { Root, Config, SidePanel, Stage } from './pages';
const IN_TEAMS = inTeams();

function App() {
	const initializeStartedRef = useRef(false);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		// This hook should only be called once, so we use a ref to track if it has been called.
		// This is a workaround for the fact that useEffect is called twice on initial render in React V18.
		// In production, you might consider using React Suspense if you are using React V18.
		// We are not doing this here because many customers are still using React V17.
		// We are monitoring the React Suspense situation closely and may revisit in the future.
		if (initializeStartedRef.current || !IN_TEAMS) return;
		initializeStartedRef.current = true;
		const initialize = async () => {
			try {
				await app.initialize();
				console.log("App.js: initialized client SDK");

				app.notifyAppLoaded();
				app.notifySuccess();
				setInitialized(true);
			} catch (error) {
				console.error(error);
			}
		};
		console.log("App.js: initializing client SDK");
		initialize();

		localStorage.debug = 'fluid:*';
	}, []);

	const appReady = (IN_TEAMS && initialized) || !IN_TEAMS;

	return (
		<>
			{appReady && (
				<FluentProvider theme={webDarkTheme}>
					<div className={styles.app}>
						<TeamsContextProvider>
							<Router basename="/">
								<Routes>
									<Route path={"/"} element={<Root />} />
									<Route path={"/config"} element={<Config />} />
									<Route path={"/sidepanel"} element={<SidePanel />} />
									<Route path={"/stage"} element={<Stage />} />
								</Routes>
							</Router>
						</TeamsContextProvider>
					</div>
				</FluentProvider>
			)}

			{!appReady && (
				<div>App is loading</div>
			)}
		</>
	)
}

export default App
