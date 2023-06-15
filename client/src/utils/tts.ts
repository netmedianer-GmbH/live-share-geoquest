export class TTS {
	private readonly rate = 1;
	private readonly pitch = 1;
	private questionVoice: SpeechSynthesisVoice; // 144
	private roundWinnerVoice: SpeechSynthesisVoice; // 146

	constructor() {
		const voices = speechSynthesis.getVoices().filter(v => v.lang == 'en-US');
		this.questionVoice = voices[0];
		this.roundWinnerVoice = voices[0];
	}

	private doTTS(text: string, voice: SpeechSynthesisVoice, pitch = this.pitch, rate = this.rate) {
		const msg = new SpeechSynthesisUtterance(text);
		msg.pitch = pitch;
		msg.rate = rate;
		// msg.voice = voice;
		window.speechSynthesis.speak(msg);
	}

	public readQuestion(text: string) {
		if (!!text.length) {
			const quest = `${text}`;
			this.doTTS(quest, this.questionVoice);
		}
	}

	public announceRoundWinner(name: string) {
		if (!!name.length) {
			const announce = `Winner of the round is ... ${name}!! Congratulations`;
			this.doTTS(announce, this.roundWinnerVoice);
		}
	}
}