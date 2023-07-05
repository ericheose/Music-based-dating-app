import styled from "styled-components";

const Section = styled.div`
	height: 100vh;
	scroll-snap-align: center;
	display: flex;
	justify-content: center;
`;

const Container = styled.div`
	height: 100vh;
	scroll-snap-align: center;
	width: 1400px;
	display: flex;
	justify-content: space-between;
`;

const ImageContainer = styled.div`
	flex: 1;
	align-items: center;
	justify-content: center;
	display: flex;

	@media only screen and (max-width: 768px) {
		display: none;
	}
`;

const TextContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 20px;

	@media only screen and (max-width: 768px) {
		align-items: center;
		text-align: center;
	}
`;

const Title = styled.h1`
	font-size: 50px;
	color: #1c1c1c;

	@media only screen and (max-width: 768px) {
		font-size: 60px;
	}
`;

const Subtitle = styled.h2`
	color: #fbbb32;
	margin-bottom: 30px;
`;

const Desc = styled.p`
	font-size: 16px;
	color: #1c1c1c;
`;

const Button = styled.button`
	background-color: #fbbb32;
	color: white;
	font-weight: 500;
	width: 150px;
	padding: 10px;
	border: none;
	border-radius: 15px;
	cursor: pointer;
	margin-top: 30px;

	&:hover {
		filter: saturate(0.9);
	}
`;

const Image = styled.img`
	width: 500;
	border-radius: 50px;
	margin-bottom: 20px;
`;

const About = () => {
	const handleClick = () => {
		fetch("http://localhost:5172/api/users/getAll", {
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error(error));
	};

	return (
		<Section>
			<Container>
				<ImageContainer>
					<Image src="images/test.png" width={500} />
				</ImageContainer>
				<TextContainer>
					<Title>Why Rhythmic Relations?</Title>
					<Subtitle>Because we're the best!</Subtitle>
					<Desc>
						RhythmicRelations was created to revolutionize the world of music dating. We empower users to connect with confidence, whether they're looking for romance,
						friendship, or networking opportunities.
						<br />
						<br />
						We understand that traditional dating apps can be limiting and often fail to cater to the unique needs and interests of music lovers. That's why we've made
						it our mission to create a safe and inclusive online community for music enthusiasts to meet and build meaningful relationships.
					</Desc>
					<Button onClick={handleClick}>Learn More</Button>
				</TextContainer>
			</Container>
		</Section>
	);
};

export default About;
