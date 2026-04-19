import { app } from '@azure/functions';

// TODO: Move this to another functions app with a reserved instance
// to prevent cold start issues.
app.setup({
  enableHttpStream: true,
});
