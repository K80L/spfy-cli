# spfy-cli

A simple command line interface for Spotify.

## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm link` to create a global symlink to the package.
4. Add the following environment variables to your `.env` file:

```
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
DEVICE_ID=your_device_id
```

## Commands

- `spfy play` - Play the current song.
- `spfy pause` - Pause the current song.
- `spfy next` - Play the next song.
- `spfy prev` - Play the previous song.
