import { Container, Grid, Typography, styled } from "@mui/material";
import React from "react";
const AchievementGrid = styled(Grid)({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
});
const Achievement = () => {
	return (
		<Container
			sx={{
				bgcolor: "#002935",
				borderRadius: 2,
				transform: "translateY(-200px)",
			}}
		>
			<Grid container spacing={1} py={5}>
				<AchievementGrid item xs={12} sm={6} md={3}>
					<Typography
						sx={{
							fontSize: 48,
							fontWeight: 700,
							mb: 1,
							color: "#fff",
						}}
					>
						50k+
					</Typography>
					<Typography
						sx={{
							fontSize: 18,
							fontWeight: 500,
							color: "#fff",
						}}
					>
						History Of High Achievers
					</Typography>
				</AchievementGrid>
				<AchievementGrid item xs={12} sm={6} md={3}>
					<Typography
						sx={{
							fontSize: 48,
							fontWeight: 700,
							mb: 1,
							color: "#fff",
						}}
					>
						30k+
					</Typography>
					<Typography
						sx={{
							fontSize: 18,
							fontWeight: 500,
							color: "#fff",
						}}
					>
						Classes Completed
					</Typography>
				</AchievementGrid>
				<AchievementGrid item xs={12} sm={6} md={3}>
					<Typography
						sx={{
							fontSize: 48,
							fontWeight: 700,
							mb: 1,
							color: "#fff",
						}}
					>
						63+
					</Typography>
					<Typography
						sx={{
							fontSize: 18,
							fontWeight: 500,
							color: "#fff",
						}}
					>
						Total Acres Of The Land
					</Typography>
				</AchievementGrid>
				<AchievementGrid item xs={12} sm={6} md={3}>
					<Typography
						sx={{
							fontSize: 48,
							fontWeight: 700,
							mb: 1,
							color: "#fff",
						}}
					>
						140+
					</Typography>
					<Typography
						sx={{
							fontSize: 18,
							fontWeight: 500,
							color: "#fff",
						}}
					>
						Awards & Achievements
					</Typography>
				</AchievementGrid>
			</Grid>
		</Container>
	);
};

export default Achievement;
