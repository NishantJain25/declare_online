import React from "react";
import { styled } from "styled-components";
import Input from "../components/Input";

const LoginContainer = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	padding: 40px;
	gap: 40px;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	flex: 1;
	width: 100%;
	background-color: red;
	padding: 0 20px;
`;

const Login = () => {
	return (
		<LoginContainer>
			<p>Login</p>
			<Form>
				<Input
					label="Email"
					name="email"
					type="email"
				/>
				<Input
					label="Password"
					name="password"
					type="password"
				/>
				<button>Login</button>
			</Form>
		</LoginContainer>
	);
};

export default Login;
