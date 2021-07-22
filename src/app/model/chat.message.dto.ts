export interface IChatMessage {
    message: string,
    sentTime: number,
    sentDateTime: string,
    sourcePhoneNumber: string
}

export class ChatMessage implements IChatMessage {
    constructor(
        public message: string,
        public sentTime: number,
        public sentDateTime: string,
        public sourcePhoneNumber: string,
    ) { }

}