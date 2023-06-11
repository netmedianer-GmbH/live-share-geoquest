import { FunctionComponent, useContext } from "react"
import { Button, Input, InputProps, Title3 } from "@fluentui/react-components";
import { useLocalStorage } from "usehooks-ts";
import styles from "../styles/Onboarding.module.scss";
import { UserList, ILiveGameContext, ILiveGameUser, LiveGameContext, TeamsContext, ITeamsContext } from ".";

type OnboardingProps = {
	// children: ReactNode,
};

export const Onboarding: FunctionComponent<OnboardingProps> = () => {
	const { teamsContext } = useContext(TeamsContext) as ITeamsContext;
	const { setUser, deleteUser, currentUser, numberOfRounds } = useContext(LiveGameContext) as ILiveGameContext;

	const [name, setName] = useLocalStorage<string>("spotalotName", teamsContext?.user?.userPrincipalName || "");

	const onBtnEnterGame = () => {
		if (teamsContext?.user?.id) {
			const user = {
				name,
				score: 0,
			} as ILiveGameUser;
			setUser(teamsContext?.user?.id, user);
		}
	};

	const onBtnLeaveGame = () => {
		if (teamsContext?.user?.id) {
			deleteUser(teamsContext?.user?.id);
		}
	};

	const onNameChange: InputProps["onChange"] = (_ev, data) => {
		setName(data.value);
	};

	return <div className={styles.centerOnPage}>
		<div className={styles.centerSpaced}>
			<Title3>Number of rounds: {numberOfRounds}</Title3>
		</div>
		{currentUser && <div className={styles.displayWrapper}>
			<div className={styles.centerSpaced}>
				<Title3>Waiting for other users ...</Title3>
			</div>
			<div className={styles.centerSpaced}>
				<Button size="large" appearance="secondary" onClick={() => onBtnLeaveGame()}>Leave game</Button>
			</div>
			<UserList showDistance={false} showScore={false} showHasGuessed={false} size="medium" />
		</div>}
		{!currentUser && <>
			<Title3 className={styles.subHeadline}>Please enter your name:</Title3>
			<Input size="large" defaultValue={name} onChange={onNameChange} appearance="underline" className={styles.nameInput} />
			<Button size="large" appearance="primary" onClick={() => onBtnEnterGame()}>Enter game</Button>
		</>}
	</div>;
}