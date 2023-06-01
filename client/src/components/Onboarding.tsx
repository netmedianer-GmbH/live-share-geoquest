import { FunctionComponent, useContext, useState } from "react"
import { Button, Input, InputProps, Title3 } from "@fluentui/react-components";
import { useLocalStorage } from "usehooks-ts";
import styles from "../styles/Onboarding.module.scss";
import { UserList, ILiveGameContext, ILiveGameUser, LiveGameContext, TeamsContext, ITeamsContext } from ".";

type OnboardingProps = {
	// children: ReactNode,
};

export const Onboarding: FunctionComponent<OnboardingProps> = () => {
	const { teamsContext } = useContext(TeamsContext) as ITeamsContext;
	const { setUser } = useContext(LiveGameContext) as ILiveGameContext;

	const [name, setName] = useLocalStorage<string>("spotalotName", teamsContext?.user?.userPrincipalName || "");
	const [userReady, setUserReady] = useState<boolean>(false);

	const onNameEnter = () => {
		if (teamsContext?.user?.id) {
			const user = {
				name,
				score: 0,
			} as ILiveGameUser;
			setUser(teamsContext?.user?.id, user);
			setUserReady(true);
		}
	};

	const onNameChange: InputProps["onChange"] = (_ev, data) => {
		setName(data.value);
	};

	return <div className={styles.centerOnPage}>
		{userReady && <>
			<Title3>Waiting for other users ...</Title3>
			<UserList showDistance={false} showScore={false} size="medium" />
		</>}
		{!userReady && <>
			<Title3>Please enter your name:</Title3>
			<Input size="large" defaultValue={name} onChange={onNameChange} appearance="underline" className={styles.nameInput} />
			<Button size="large" appearance="primary" onClick={() => onNameEnter()}>Enter game</Button>
		</>}
	</div>;
}