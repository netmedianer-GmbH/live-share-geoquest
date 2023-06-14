import { FunctionComponent, ReactNode, useContext } from "react";
import { Table, TableBody, TableCell, TableContextValue, TableHeader, TableHeaderCell, TableRow } from "@fluentui/react-components";
import { LiveGameContext, ILiveGameContext, ILiveGameUser } from ".";
import { DistanceHelper } from "../utils";
import styles from "../styles/UserList.module.scss";

type UserListProps = {
	showScore?: boolean;
	showLastScore?: boolean;
	showDistance?: boolean;
	showHasGuessed?: boolean;
	size: TableContextValue["size"];
}

export interface ILiveGameUserList extends ILiveGameUser {
	key: string;
}

export const UserList: FunctionComponent<UserListProps> = ({ showScore = false, showLastScore = false, showDistance = false, showHasGuessed = false, size }) => {
	const { userMap, question } = useContext(LiveGameContext) as ILiveGameContext;

	const userList: ILiveGameUserList[] = [];
	userMap.forEach((user, key) => {
		userList.push({
			...user,
			key
		});
	});

	// Sort by 1. score --> 2. name
	userList.sort((a, b) => {
		if (a.score < b.score) {
			return 1;
		}
		if (a.score > b.score) {
			return -1;
		}
		return a.name.localeCompare(b.name);
	});

	const maxLastScore = Math.max(...userList.map(o => o.lastScore));

	const usersTable: ReactNode[] = [];
	let position = 1;
	userList.forEach((user) => {
		const distance = (user.position && question) ? `${DistanceHelper.getPositionDistance(user.position, question.location).toFixed(2)} km` : "---";

		const highestLastScore = (showLastScore && user.lastScore && user.lastScore === maxLastScore) ? "🏅" : "";
		const suffixLastScore = (showLastScore && user.lastScore) ? <span className={styles.nowrap}>{`(+${user.lastScore.toFixed(0)}${highestLastScore})`}</span> : "";
		let suffixMedal = "";
		if (user.score > 0 && position === 1) suffixMedal = " 🥇";
		if (user.score > 0 && position === 2) suffixMedal = " 🥈";
		if (user.score > 0 && position === 3) suffixMedal = " 🥉";
		usersTable.push(<TableRow key={user.key} appearance={(user.positionSet) ? "brand" : "neutral"}>
			{(showScore) ? <TableCell>{user.score.toFixed(0)} {suffixLastScore}</TableCell> : <></>}
			<TableCell>{user.name}{suffixMedal}</TableCell>
			{(showDistance) ? <TableCell>{distance}</TableCell> : <></>}
			{(showHasGuessed) ? <TableCell>{(user.positionSet && user.positionSetMillis) ? `After ${(user.positionSetMillis / 1000).toFixed(1)} s` : "---"}</TableCell> : <></>}
		</TableRow>);
		position++;
	});

	return (
		<div className={styles.userTable}>
			<Table size={size} aria-label="List of all users">
				<TableHeader className={styles.userTableHeader}>
					{(showScore) ? <TableHeaderCell>Score</TableHeaderCell> : <></>}
					<TableHeaderCell>User name</TableHeaderCell>
					{(showDistance) ? <TableHeaderCell>Distance</TableHeaderCell> : <></>}
					{(showHasGuessed) ? <TableHeaderCell>Guess fixed?</TableHeaderCell> : <></>}
				</TableHeader>
				<TableBody className={styles.userTableBody}>
					{usersTable}
				</TableBody>
			</Table>
		</div>
	);
};