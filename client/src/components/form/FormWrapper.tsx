import { ReactNode } from "react";
import "../../styles/form.css";

type FormWrapperProps = {
	title: string;
	children: ReactNode;
};

export function FormWrapper({ title, children }: FormWrapperProps) {
	return (
		<>
			<h2>{title}</h2>
			<div id="form-wrapper">{children}</div>
		</>
	);
}
