import { FunctionComponent, ReactNode, useContext } from "react";
import { DistanceHelper } from "../utils/DistanceHelper";
import { LiveGameContext, ILiveGameContext, ILiveGameUser } from "./LiveShareContextProvider";
import { Table, TableBody, TableCell, TableContextValue, TableHeader, TableHeaderCell, TableRow } from "@fluentui/react-components";
import styles from "../styles/UserList.module.scss";

type UserListProps = {
	showScore: boolean;
	showDistance: boolean;
	size: TableContextValue["size"];
}

export interface ILiveGameUserList extends ILiveGameUser {
	key: string;
}

export const UserList: FunctionComponent<UserListProps> = ({ showScore, showDistance, size }) => {
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

		usersTable.push(<TableRow key={user.key}>
			{(showScore) ? <TableCell>{user.score.toFixed(2)} km</TableCell> : <></>}
			<TableCell>{user.name}</TableCell>
			{(showDistance) ? <TableCell>{distance}</TableCell> : <></>}
		</TableRow>);
	});

	return (
		<div className={styles.userTable}>
			<Table size={size} aria-label="List of all users">
				<TableHeader className={styles.userTableHeader}>
					{(showScore) ? <TableHeaderCell>Score</TableHeaderCell> : <></>}
					<TableHeaderCell>User name</TableHeaderCell>
					{(showDistance) ? <TableHeaderCell>Distance</TableHeaderCell> : <></>}
				</TableHeader>
				<TableBody className={styles.userTableBody}>
					{usersTable}
				</TableBody>
			</Table>
		</div>
	);
};