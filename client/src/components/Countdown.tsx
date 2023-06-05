import { FunctionComponent, useContext } from "react"
import { Title3 } from "@fluentui/react-components";
import styles from "../styles/Countdown.module.scss";
import { ILiveGameContext, LiveGameContext } from "./LiveShareContextProvider";
import { GameTimer } from "./GameTimer";

type CountdownProps = {
	// children: ReactNode,
};

export const Countdown: FunctionComponent<CountdownProps> = () => {
	const { question, timerMilliRemaining1 } = useContext(LiveGameContext) as ILiveGameContext;

	return <div className={styles.centerOnPage}>
		<Title3><GameTimer timerMilliRemaining={timerMilliRemaining1} /></Title3>
		<Title3 className={styles.question}>Your task: <br />{question?.question}</Title3>
		{question?.imageUrl && <img src={question.imageUrl} className={styles.questionImage} />}
	</div>;
}