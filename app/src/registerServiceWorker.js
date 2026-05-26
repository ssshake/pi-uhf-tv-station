import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('Pi TV Remote is ready to work offline.');
    },
    registered() {
      console.log('Service worker registered.');
    },
    updated() {
      console.log('New content available; refresh to update.');
    },
    offline() {
      console.log('Running offline — cached UI only.');
    },
    error(error) {
      console.error('Service worker registration failed:', error);
    },
  });
}
