import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatMessage } from './model/chat.message.dto';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'longpollchatclient';
  phoneNumber = null;
  name = "Test";
  message = null;
  isRegisteredUser = false;
  getAll = true;
  chatMessages: ChatMessage[] = []
  subscription: Subscription
  lastRequestCompleted = true;

  constructor(private chatService: ChatService) {
  }
  registerUser() {
    this.chatService.registerUser({
      phoneNumber: this.phoneNumber,
      name: this.name
    }).subscribe(
      result => {
        sessionStorage.setItem("phoneNumber", this.phoneNumber);
        sessionStorage.setItem("name", this.name);
        this.isRegisteredUser = true;

        this.getNewMessages()
      }
    )
  }

  chat() {
    let chatRequest: ChatMessage = {
      message: this.message,
      sourcePhoneNumber: this.phoneNumber,
      sentTime: null,
      sentDateTime: null
    }
    this.chatService.chat(chatRequest).subscribe(
      result => {
        this.addMessageAndSortByTime(result);
        this.message = null;
      }
    )
  }

  addMessageAndSortByTime(message: ChatMessage) {
    this.chatMessages.push(message);

    this.sortChatMessagesByTime();
  }

  sortChatMessagesByTime() {
    // sort
    this.chatMessages.sort((msg1: ChatMessage, msg2: ChatMessage) => {
      if (msg1.sentTime > msg2.sentTime) {
        return -1;
      } else if (msg1.sentTime < msg2.sentTime) {
        return 1;
      }
      return 0;
    })

    console.info('sorted chat messages : ', this.chatMessages)
  }

  getNewMessages() {
    this.lastRequestCompleted = false;
    if (this.phoneNumber) {
      this.chatService.getMessages(this.phoneNumber, this.getAll).subscribe(
        result => {
          this.chatMessages = this.chatMessages.concat(result);

          this.getAll = false;

          this.sortChatMessagesByTime();
          this.lastRequestCompleted = true;
        },
        error => {
          console.error('Encountered error : ', error)
          this.lastRequestCompleted = true;
        }
      )
    }
  }

  ngOnInit(): void {
    console.log("On init")

    this.phoneNumber = sessionStorage.getItem("phoneNumber");
    this.name = sessionStorage.getItem("name");

    console.log('phoneNumber : ', this.phoneNumber)
    console.log('name : ', this.name)

    if (this.phoneNumber) {
      this.isRegisteredUser = true;
    }

    let source = interval(1000);
    this.subscription = source.subscribe(() => {
      if (this.lastRequestCompleted) {
        this.getNewMessages();
      }
    });
  }
}
