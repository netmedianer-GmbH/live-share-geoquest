import { FunctionComponent, ReactNode, createContext, useEffect, useRef, useState } from "react";
import { Spinner } from "@fluentui/react-components";
import { app } from "@microsoft/teams-js";
import { inTeams } from "../utils";

// Create LiveGame context
export interface ITeamsContext {
	teamsContext?: app.Context;
}
export const TeamsContext = createContext<ITeamsContext>({});

type TeamsContextProviderProps = {
	children: ReactNode,
};

const IN_TEAMS = inTeams();

export const TeamsContextProvider: FunctionComponent<TeamsContextProviderProps> = ({ children }) => {
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<unknown | undefined>();
	const loadingRef = useRef(false);
	const [teamsContext, setTeamsContext] = useState<app.Context>();


	const initialize = async () => {
		try {
			await app.initialize();
			const ctx = await app.getContext();
			setTeamsContext(ctx);
			setIsInitialized(true);
		}
		catch (error) {
			console.error(error);
			setError(error);
		}
	}

	useEffect(() => {
		if (loadingRef.current) return;
		loadingRef.current = true;

		if (IN_TEAMS) {
			initialize();
		}
	}, []);


	if (!isInitialized && IN_TEAMS) {
		return <Spinner label="Teams loading" />;
	}
	if (error) {
		return <div>Teams context error: {JSON.stringify(error)}</div>
	}
	return <TeamsContext.Provider value={{ teamsContext }}>
		{children}
	</TeamsContext.Provider>
};