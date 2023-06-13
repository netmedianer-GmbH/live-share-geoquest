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
		if (a.score > b.score) {
			return 1;
		}
		if (a.score < b.score) {
			return -1;
		}
		return a.name.localeCompare(b.name);
	});

	const usersTable: ReactNode[] = [];
	userList.forEach((user) => {
		const distance = (user.position && question) ? `${DistanceHelper.getPositionDistance(user.position, question.location).toFixed(2)} km` : "---";

		const suffixLastScore = (showLastScore && user.lastScore) ? ` (+${user.lastScore.toFixed(0)})` : "";
		usersTable.push(<TableRow key={user.key} appearance={(user.positionSet) ? "brand" : "neutral"}>
			{(showScore) ? <TableCell>{user.score.toFixed(0)}{suffixLastScore}</TableCell> : <></>}
			<TableCell>{user.name}</TableCell>
			{(showDistance) ? <TableCell>{distance}</TableCell> : <></>}
			{(showHasGuessed) ? <TableCell>{(user.positionSet && user.positionSetMillis) ? `After ${(user.positionSetMillis / 1000).toFixed(1)} s` : "---"}</TableCell> : <></>}
		</TableRow>);
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