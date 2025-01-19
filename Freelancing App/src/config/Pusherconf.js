import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { Baseurl } from './Appurl';

const echo = new Echo({
    broadcaster: 'pusher',
    key: '06f50eed18cec867641b', 
    cluster: 'ap2',
    forceTLS: true,
 
});

// Export the configured Echo instance
export default echo;
