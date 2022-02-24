export interface PubSubService {
  name: string;
}

export interface EmailService {
  name: string;
}

export interface RootConfig {
  pubsub: PubSubService;
  email: EmailService;
}

export interface Props {
  myId: string;
}
