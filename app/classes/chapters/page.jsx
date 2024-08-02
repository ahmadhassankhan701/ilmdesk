"use client";
import { db } from "@/firebase";
import { ExpandMore, NavigateNext } from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Breadcrumbs,
	Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { Backdrop } from "@mui/material";

const ChaptersPage = () => {
	const route = useRouter();
	const searchParam = useSearchParams();
	const selectedClass = searchParam.get("selectedClass");
	const subject = searchParam.get("subject");
	const [chapters, setChapters] = useState([]);
	useEffect(() => {
		const fetchChapters = async () => {
			if (!selectedClass || !subject) {
				route.push("/classes");
				return;
			}
			const docsRef = collection(db, `Class/${selectedClass}/${subject}`);
			const snapshot = await getDocs(docsRef);
			const chaptersArray = [];
			const topicsArray = [];
			if (snapshot.size !== 0) {
				snapshot.forEach((doc) => {
					const data = doc.data();
					const chapterNumber = data.chapterNumber;
					const chapter = data.chapter;
					const topicNumber = data.topicNumber;
					const topic = data.topic;
					// Add chapter to chapters array if it doesn't already exist
					if (!chaptersArray.some((ch) => ch.chapterNumber === chapterNumber)) {
						chaptersArray.push({ chapterNumber, chapter });
					}
					// Add topic to topics array
					topicsArray.push({ chapterNumber, topicNumber, topic });
				});
				// Sort chapters by chapterNumber
				chaptersArray.sort((a, b) => a.chapterNumber - b.chapterNumber);
				// Sort topics by chapterNumber and topicNumber
				topicsArray.sort((a, b) => {
					if (a.chapterNumber === b.chapterNumber) {
						return a.topicNumber - b.topicNumber;
					}
					return a.chapterNumber - b.chapterNumber;
				});
				// Separate topics by chapters
				const separatedTopics = chaptersArray.map((chapter) => {
					return {
						chapterNumber: chapter.chapterNumber,
						chapter: chapter.chapter,
						topics: topicsArray
							.filter((topic) => topic.chapterNumber === chapter.chapterNumber)
							.map((topic) => ({
								topicNumber: topic.topicNumber,
								topic: topic.topic,
							})),
					};
				});
				setChapters(separatedTopics);
			}
		};
		fetchChapters();
	}, []);

	const breadCrumbs = [
		{ name: "Home", url: "/" },
		{ name: "Classes", url: "/classes" },
		{ name: "Chapters", url: "#" },
	];
	return (
		<Box>
			<Box
				sx={{
					background: `url(/ResourcesTopBanner.png)`,
					backgroundColor: "#000000",
					backgroundSize: "cover",
					height: "60vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					pl: 10,
					justifyContent: "center",
				}}
			>
				<Box>
					<Typography
						sx={{
							fontSize: 48,
							fontWeight: 700,
							color: "#FFFFFF",
							mb: 1,
						}}
					>
						{subject}
					</Typography>
					<Breadcrumbs
						separator={<NavigateNext fontSize="small" />}
						aria-label="breadcrumb"
						sx={{ color: "#fff" }}
					>
						{breadCrumbs.map((item, i) => (
							<Link
								href={item.url}
								key={i}
								style={{ color: "#fff", textDecoration: "none" }}
							>
								<Typography>{item.name}</Typography>
							</Link>
						))}
					</Breadcrumbs>
				</Box>
			</Box>
			<Box sx={{ mx: { xs: 0, sm: 10 } }} mt={5}>
				<Typography
					sx={{
						fontSize: 20,
						fontWeight: 800,
						color: "gray",
						mt: 1,
					}}
				>
					{chapters.length} chapters - {selectedClass} - {subject}
				</Typography>
				<Box mt={5}>
					{Object.keys(chapters).length > 0 ? (
						chapters.map((item) => (
							<Accordion key={item.chapterNumber}>
								<AccordionSummary
									expandIcon={<ExpandMore />}
									aria-controls="panel2-content"
									id="panel2-header"
								>
									{item.chapterNumber} - {item.chapter}
								</AccordionSummary>
								{item.topics.map((topic) => (
									<AccordionDetails
										key={topic.topicNumber}
										sx={{ cursor: "pointer" }}
									>
										<Link
											href={{
												pathname: "/classes/details",
												query: {
													selectedClass: selectedClass,
													subject: subject,
													chapter: item.chapter,
													topic: topic.topic,
												},
											}}
											style={{
												textDecoration: "none",
												color: "inherit",
											}}
										>
											<Typography>
												{topic.topicNumber} - {topic.topic}
											</Typography>
										</Link>
									</AccordionDetails>
								))}
							</Accordion>
						))
					) : (
						<Box
							width={"100%"}
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							bgcolor={"#ffffff"}
						>
							<Box sx={{ width: 400 }}>
								<img src="/no_item.jpg" width={"100%"} height={350} />
								<Typography
									textAlign={"center"}
									fontSize={16}
									my={2}
									fontWeight={"bold"}
								>
									No chapters available
								</Typography>
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};
const PageWrapper = () => (
	<Suspense fallback={<Backdrop
		sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
		open={true}
	>
		<img src={"/loader.gif"} width={100} height={100} />
	</Backdrop>}>
		<ChaptersPage />
	</Suspense>
);
export default PageWrapper;
