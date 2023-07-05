import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import styled from "styled-components";
import MatchDisplay, { MatchDisplayData } from "./Components/MatchDisplay";
import { Button } from "@mui/material"
import { Match } from "../../models/matchModel";
import { LoggedInUserContext } from "../../App";
import './Dashboard.css'
import DashboardMatchDisplay from "./Components/ChatDisplay";
import { Link } from "react-router-dom";
import ChatDisplay from "./Components/ChatDisplay";


const Container = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	background-image: linear-gradient(to right, #f1c057, #f297a6);
`;

const Title = styled.h1`
	font-size: 90px;
	align-self: center;
	padding-top: 2rem;
	padding-bottom: 1rem;
	text-align: center;

	@media only screen and (max-width: 768px) {
		text-align: center;
	}
`;

const Subtitle = styled.h2`
	font-size: 20px;
	font-weight: bold;
	color: rgba(255, 255, 255, 0.87);
`;

const SubSubTitle = styled.h2`
	font-size: 15px;
	color: rgba(255, 255, 255, 0.87);
`;

const Content = styled.div`
	margin: 0 3rem;
`;

const matchmaker = () => {
	const url = `/api/match/`;
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((data) => {

		})
		.catch((error) => {
			console.error(error);
		});
		setTimeout(() => {
			// Timeout to allow for the database to update
			window.location.reload();
		}, 1000);
	
};

const checkEmpty = async () => {
    const url = "/api/match";
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
		if (data.length === 0) {
			return false;
		}
		else {
			return true;
		}
    } catch (error) {
        console.error(error);
    }
};

const Dashboard = () => {

	const [matchesExist, checkMatches] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const result = await checkEmpty();
			checkMatches(result || false);
			console.log(result);
		  } catch (error) {
			console.error(error);
		  }
		};
		fetchData();
	}, []);

	if (matchesExist === false) {
		return (
			<Container>
				<Navbar />
				<Content>
					<div className="landingOutline">
						<Title>Welcome to Rhythmic Relations</Title>
						<Subtitle>To match, use the generate match button below and find someone with similar music taste</Subtitle>
						<Button sx={{ boxShadow: 10}} variant="contained" onClick={matchmaker} id="noMatchGenerate">Generate Match</Button>
						<div style={{display: "flex", flexDirection: "row", alignSelf: "center"}}>
							<SubSubTitle>Not finding a match? Try adding more music interests through the&nbsp;</SubSubTitle>
							<Link to='/profileSettings'>
								<SubSubTitle style={{color: '#0645AD'}}>settings page</SubSubTitle>
							</Link>
						</div>
						
					</div>
				</Content>
			</Container>
		);
	}

	return (
		<Container>
			<Navbar />
			<Content>
				<div>
					<div className="centerDiv">
						<Title style={{paddingBottom: '1rem', fontSize: '70px'}}>Dashboard</Title>
					</div>
					<div className="centerDiv">
						<Button sx={{ boxShadow: 10}} variant="contained" onClick={matchmaker} id="moreMatchGenerate">Generate New Match</Button>
					</div>

					<MatchDisplay />

					<ChatDisplay />
				</div>
			</Content>
		</Container>
	);
};

export default Dashboard;
