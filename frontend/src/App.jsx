import React from "react";
import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from "react-router-dom";
import "./App.css";
import MainMenu from "./views/MainMenu";
import HomePage from "./HomePage";
import Login from "./views/Login";
import Register from "./views/Register";
import PlayGame from "./views/PlayGame";
import JoinGame from "./views/JoinGame";
import SocketProvider from "./context/socketContext.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path={"/"}
			element={<HomePage />}>
			<Route
				index
				element={<MainMenu />}
			/>
			<Route
				path={"login"}
				element={<Login />}
			/>
			<Route
				path={"register"}
				element={<Register />}
			/>
			<Route
				path={"playGame/:roomId"}
				element={<PlayGame />}
			/>
			<Route
				path={"joinGame"}
				element={<JoinGame />}
			/>
		</Route>
	)
);

function App({ routes }) {
	return (
		<SocketProvider>
			<RouterProvider router={router} />
		</SocketProvider>
	);
}

export default App;
