import { main } from './app';

(async () => {
  try {
    await main();
  } catch (err) {
    console.error(err);
  }
})();
