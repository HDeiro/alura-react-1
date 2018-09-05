import PubSub from 'pubsub-js';

export default class ExceptionHandler {
    constructor(error) {
        error && error.errors.forEach(detectedError => {
            detectedError.errorField = detectedError.codes.join('-');
            PubSub.publish('exception-handler', detectedError);
        });
    }
}