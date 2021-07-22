import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { API_ENDPOINT } from "./app.constant";
import { Observable } from "rxjs";
import { ChatMessage, IChatMessage } from "./model/chat.message.dto";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(
        public httpClient: HttpClient
    ) { }

    apiBaseUrl = API_ENDPOINT + "/api";

    registerUser(user): Observable<any> {
        return this.httpClient.post(this.apiBaseUrl + "/user", user);
    }

    chat(message: ChatMessage): Observable<any> {
        return this.httpClient.post(this.apiBaseUrl + "/chat", message);
    }

    getMessages(userPhoneNumber, getAll?: Boolean) : Observable<ChatMessage[]> {
        return this.httpClient.get<ChatMessage[]>(this.apiBaseUrl + "/messages/" + userPhoneNumber + "?getAll=" + getAll);
    }

}