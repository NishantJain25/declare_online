"use client";

import { Button } from "@/app/page";
import { styled } from "styled-components";

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

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
`;

const StyledInput = styled.input`
	height: 30px;
	width: 100%;
`;

export const Input = ({ name, type, label }) => {
	return (
		<InputContainer>
			{label && <label>{label}</label>}
			<StyledInput
				name={name}
				type={type}
			/>
		</InputContainer>
	);
};

export default function Login() {
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
}
