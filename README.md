# Rhythmic Relations

This repository contains the code for Rhythmic Relations, an app that helps users find relationships through music. Features include matching based on similar songs, artists, genre, and albums, a real-time chat system, Spotify music player, and social media integration.

To get started with running the project, please follow the instructions below.

## Prerequisites

Before running the app, please ensure that you have the following installed:

- `yarn` (globally installed): ```npm i -g yarn```
- Node version 18 or above

## Installation

To run this project, you will need to clone the repository, install the necessary packages, and start the development server. Here are the steps:

1. Clone the repository using Git:

```bash
git clone https://github.com/UOA-CS732-SE750-Students-2023/project-group-enlightened-elks.git
```

2. Navigate to the project directory frontend:

```bash
cd project-group-enlightened-elks/client
```

3. Install the required packages using yarn:

```bash
yarn
```

4. Also navigate to the project directory backend:

```bash
cd project-group-enlightened-elks/backend
```

5. Install the required packages using npm:

```bash
npm install
```

## Usage

Before running the application, be sure to update the `.env` file with your own MongoDB connection string.

```bash
MONGO_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

To run the project, navigate to the backend directory and use the following command:

```bash
npm start
```

This will start a local development server at http://localhost:5173, where you can view the project in your browser.

## Testing

The project includes unit tests to for correct endpoint responses in the backend. To run these tests, navigate to the backend directory and use the following command:

```bash
npm test
```

This will run all of the tests in the project. You can also run individual tests by specifying test name.

```bash
npm test userController.test.ts
```

So in this case replace "userController.test.ts" with any other tests. These tests can be found in the backend/src/__tests__ directory.

## Credits

This project was developed by the group [Enlightened Elks](https://github.com/UOA-CS732-SE750-Students-2023/project-group-enlightened-elks/wiki)

## Resources

This project was created using the M.E.R.N stack, MongoDB, ExpressJS, React + TypeScript built with Vite and NodeJS. Additionally, the project used other libraries and frameworks such as:

- express-session
- jest
- material-ui
- socket.io
- multer

## Contributing

If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/UOA-CS732-SE750-Students-2023/project-group-enlightened-elks). Pull requests are welcome!

## License

This project is licensed under the terms of the MIT License.
