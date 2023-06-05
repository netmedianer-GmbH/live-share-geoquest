import { FunctionComponent, useMemo } from "react";
import { formatTimeValue } from "../utils";
import { Text } from "@fluentui/react-components";
import styles from "../styles/GameTimer.module.scss";

type GameTimerProps = {
	timerMilliRemaining: number,
}

export const GameTimer: FunctionComponent<GameTimerProps> = ({ timerMilliRemaining }) => {
	const formattedTimestamp = useMemo((): string => {
		if (!timerMilliRemaining) {
			return "0:00";
		}
		return formatTimeValue(timerMilliRemaining);
	}, [timerMilliRemaining]);

	return (
		<div className={styles.gameTimerWrapper}>
			<div className={styles.gameTimerTextWrapper}>
				<Text size={800}>
					Timer:&nbsp;
				</Text>
				<Text size={800} weight="bold">
					{formattedTimestamp}
				</Text>
			</div>
		</div>
	);
};