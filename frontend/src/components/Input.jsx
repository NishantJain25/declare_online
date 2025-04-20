import React from "react";
import { styled } from "styled-components";

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

const Input = ({ name, type, label, onFocus }) => {
	return (
		<InputContainer>
			{label && <label>{label}</label>}
			<StyledInput
				name={name}
				type={type}
				onFocus={onFocus}
			/>
		</InputContainer>
	);
};

export default Input;
