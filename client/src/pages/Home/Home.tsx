import React from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";

import Hero from "./Components/Hero";
import About from "./Components/About";
import Testimonals from "./Components/Testimonials";

const Container = styled.div`
	height: 100vh;
	color: white;
	scroll-behavior: smooth;
	overflow-y: auto;
	background-color: #f5f5f5;
`;

const Home = () => {
	return (
		<Container>
			<Hero />
			<About />
			<Testimonals/>
		</Container>
	);
};

export default Home;
