import {PubSub} from '@google-cloud/pubsub';
import Logger from '../helper/logger';
import Utils from '../helper/utils';

const TOPIC_NAME: string = Utils.getEnvVariable('TOPIC_NAME', true);
const pubSub: PubSub=  new PubSub();

export default class Index {

    public static publish = async (data: any): Promise<string> =>{
        try {
            const dataBuffer = Buffer.from(JSON.stringify(data));
            const messageId = await pubSub.topic(TOPIC_NAME).publish(dataBuffer);
            return messageId;
        } catch (error) {
            Logger.error(`Error in publishing event: ${error}`);
            throw error;
        }
    };

  /*  public static async start(): Promise<void> {
        try {
            const subscription = pubsub.subscription(SUBSCRIPTION_NAME);
            subscription.on(`message`, (message) => {
                console.log(message.data);
                message.ack();
            });
        } catch (error) {
            Logger.error(`Error in starting event subscription: ${error}`);
            throw error;
        }
    }*/
}
