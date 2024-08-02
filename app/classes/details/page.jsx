"use client";
import {
	ArrowForwardIos,
	CheckCircleOutlineOutlined,
	Delete,
	NavigateNext,
	Quiz,
	Star,
	StarOutline,
} from "@mui/icons-material";
import {
	Avatar,
	Backdrop,
	Box,
	Breadcrumbs,
	Button,
	CardMedia,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { db } from "@/firebase";
import renderHTML from "react-render-html";
import moment from "moment";
import PDFModal from "@/components/Modals/PDFModal";
const DetailsPage = () => {
	const route = useRouter();
	const searchParam = useSearchParams();
	const selectedClass = searchParam.get("selectedClass");
	const subject = searchParam.get("subject");
	const chapter = searchParam.get("chapter");
	const topic = searchParam.get("topic");
	const [content, setContent] = useState(null);
	const [quizzes, setQuizzes] = useState(null);
	const [loading, setLoading] = useState(true);
	const [pdfModal, setPdfModal] = useState(false);
	const [pdfURL, setPdfURL] = useState("");
	useEffect(() => {
		if (!selectedClass || !chapter || !subject || !topic) {
			route.push("/classes");
			return;
		} else {
			fetchContent();
			fetchQuizList();
		}
	}, []);
	const fetchContent = async () => {
		try {
			const docRef = collection(db, `Class/${selectedClass}/${subject}`);
			const q = query(
				docRef,
				where("chapter", "==", chapter),
				where("topic", "==", topic)
			);
			const fetchData = await fetchRequest(q);
			setContent(fetchData);
		} catch (error) {
			setLoading(false);
			console.log(error);
			toast.error("Failed to fetch content");
		}
	};
	const fetchQuizList = async () => {
		try {
			setLoading(true);
			const docsRef = collection(db, `Quiz/${selectedClass}/${subject}`);
			const q = query(
				docsRef,
				where("chapter", "==", chapter),
				where("topic", "==", topic)
			);
			const querySnapshot = await getDocs(q);
			let items = [];
			if (querySnapshot.size !== 0) {
				querySnapshot.docs.map((doc) => {
					items.push({
						key: doc.id,
						quizTitle: doc.data().quizTitle,
						quizNumber: doc.data().quizNumber,
						mode: doc.data().mode,
						duration: doc.data().duration,
						totalQuestions: doc.data().questions.length,
					});
					items.sort((a, b) => a.quizNumber - b.quizNumber);
				});
			}
			setQuizzes(items);
		} catch (error) {
			console.log(error);
		}
	};
	const fetchRequest = async (query) => {
		try {
			setLoading(true);
			const snapshot = await getDocs(query);
			if (snapshot.empty) {
				setLoading(false);
				return null;
			}
			const docId = snapshot.docs[0].id;
			const docData = snapshot.docs[0].data();
			setLoading(false);
			return { key: docId, ...docData };
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};
	const breadCrumbs = [
		{ name: "Home", url: "/" },
		{ name: "Classes", url: "/classes" },
		{
			name: content && content.topic ? content.topic : "Topic",
			url: "#",
		},
	];

	return (
		<Box>
			<PDFModal open={pdfModal} setOpen={setPdfModal} url={pdfURL} />
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
						{content && content.topic ? content.topic : "Topic"}
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
			<Box sx={{ mx: { xs: 1, lg: 10 } }}>
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={loading}
				>
					<img src={"/loader.gif"} width={100} height={100} />
				</Backdrop>
				{content ? (
					<Grid container spacing={2}>
						<Grid item xs={12} md={8}>
							<img
								src={content.image ? content.image : "/courseCategImg.jpg"}
								style={{
									width: "100%",
									height: 500,
									marginTop: 43,
									borderRadius: 10,
									objectFit: "cover",
									objectPosition: "center",
								}}
							/>
							<Box
								sx={{
									bgcolor: "#fff",
									borderTopLeftRadius: 0,
									borderTopRightRadius: 0,
									borderBottomLeftRadius: 10,
									borderBottomRightRadius: 10,
									boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
									transform: "translateY(-50px)",
								}}
							>
								<Grid container spacing={2}>
									<Grid item xs={12} md={4}>
										<Box display={"flex"} justifyContent={"center"} gap={2}>
											<Box>
												<Avatar
													src={"/avatar.png"}
													sizes="large"
													sx={{ bgcolor: "transparent", fontSize: 50 }}
												/>
											</Box>
											<Box>
												<Typography
													sx={{
														fontWeight: "700",
														fontSize: 16,
														paddingBottom: 1,
														color: "#000",
														textAlign: "center",
													}}
												>
													Mr Qasim
												</Typography>
												<Typography
													sx={{
														fontWeight: 500,
														fontSize: 14,
														paddingBottom: 1,
														color: "#000",
														textAlign: "center",
													}}
												>
													Sr. Instructor
												</Typography>
											</Box>
										</Box>
									</Grid>
									<Grid item xs={12} md={4}>
										<Box>
											<Typography
												sx={{
													fontWeight: "700",
													fontSize: 16,
													paddingBottom: 1,
													color: "#000",
													textAlign: "center",
												}}
											>
												Category
											</Typography>
											<Typography
												sx={{
													fontWeight: 500,
													fontSize: 14,
													paddingBottom: 1,
													color: "#000",
													textAlign: "center",
												}}
											>
												{selectedClass}
											</Typography>
										</Box>
									</Grid>
									<Grid item xs={12} md={4}>
										<Box
											display={"flex"}
											alignItems={"center"}
											justifyContent={"center"}
											gap={1}
											sx={{ cursor: "pointer", my: 2 }}
										>
											<Typography
												sx={{
													color: "rgb(74, 83, 85)",
													fontSize: 16,
													fontWeight: 700,
													cursor: "pointer",
													textTransform: "none",
												}}
											>
												{content.ratings?.length} ratings
											</Typography>
											{Array(3)
												.fill()
												.map((_, i) => (
													<Star
														key={"filled" + i}
														sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }}
													/>
												))
												.concat(
													Array(5 - 3)
														.fill()
														.map((_, i) => (
															<StarOutline
																key={"unfilled" + i}
																sx={{
																	color: "rgb(255, 164, 27)",
																	fontSize: 14,
																}}
															/>
														))
												)}
										</Box>
									</Grid>
								</Grid>
							</Box>
							<Box sx={{ mt: 5 }}>
								<Typography
									variant="h6"
									sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
								>
									Overview
								</Typography>
								<Typography
									variant="div"
									component={"div"}
									sx={{ fontSize: 16, color: "#001920", mt: 1 }}
								>
									{renderHTML(content.desc)}
								</Typography>
							</Box>
							{content.contentFiles?.length > 0 && (
								<Box sx={{ mt: 5 }}>
									<Typography
										variant="h6"
										sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
									>
										Content Files
									</Typography>
									<Box>
										{content.contentFiles.map((file, i) => (
											<Box
												key={i}
												sx={{
													bgcolor: "#fff",
													borderRadius: 2,
													boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
													p: 1,
													mt: 1,
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
												}}
											>
												<Box>
													<Typography
														variant="body1"
														sx={{ fontSize: 16, color: "red" }}
													>
														{file.name}
													</Typography>
												</Box>
												<Box
													display={"flex"}
													alignItems={"center"}
													justifyContent={"center"}
													gap={1}
												>
													<Button
														variant="contained"
														color="secondary"
														size="small"
														sx={{ fontSize: 14, textTransform: "none" }}
														onClick={() => {
															setPdfURL(file?.fileUrl);
															setPdfModal(true);
														}}
													>
														Read
													</Button>
												</Box>
											</Box>
										))}
									</Box>
								</Box>
							)}
							{content.youtube?.length > 0 && (
								<Box sx={{ mt: 5 }}>
									<Typography
										variant="h6"
										sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
									>
										Youtube Videos
									</Typography>
									<Box>
										<Grid container spacing={1} sx={{ padding: 1, mb: 1 }}>
											{content.youtube.map((item, index) => (
												<Grid item xs={12} sm={6} key={`quest-${index}`}>
													<Box
														sx={{
															bgcolor: "#fff",
															borderRadius: 2,
															boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
															p: 1,
															display: "flex",
															flexDirection: "column",
															justifyContent: "center",
															alignItems: "center",
														}}
													>
														<CardMedia
															component="iframe"
															title={"Youtube Lecture"}
															src={item}
															height={250}
															allowFullScreen
														/>
													</Box>
												</Grid>
											))}
										</Grid>
									</Box>
								</Box>
							)}
							<Box sx={{ mt: 5 }}>
								<Typography
									variant="h6"
									sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
								>
									Reviews
								</Typography>
								{content.ratings?.length > 0 ? (
									content.ratings.map((review, i) => (
										<Box
											sx={{
												bgcolor: "#fff",
												borderRadius: 2,
												boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
												p: 3,
												mt: 2,
												display: "flex",
												gap: 3,
											}}
											key={i}
										>
											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Avatar
													src={
														review.userImage ? review.userImage : "/avatar.png"
													}
													sx={{ bgcolor: "transparent", fontSize: 50, mb: 1 }}
												/>
												<Typography
													sx={{
														fontWeight: 500,
														fontSize: 14,
														paddingBottom: 1,
														color: "gray",
														minWidth: 100,
														textAlign: "center",
													}}
												>
													{moment(review.createdAt.seconds * 1000).fromNow()}
												</Typography>
											</Box>
											<Box>
												<Box
													display={"flex"}
													alignItems={"center"}
													gap={1}
													sx={{ cursor: "pointer", my: 2 }}
												>
													{Array(parseInt(review.rating))
														.fill()
														.map((_, i) => (
															<Star
																key={i}
																sx={{
																	color: "rgb(255, 164, 27)",
																	fontSize: 14,
																}}
															/>
														))
														.concat(
															Array(5 - parseInt(review.rating))
																.fill()
																.map((_, i) => (
																	<StarOutline
																		key={i}
																		sx={{
																			color: "rgb(255, 164, 27)",
																			fontSize: 14,
																		}}
																	/>
																))
														)}
												</Box>
												<Typography variant="body1">
													{review.feedback}
												</Typography>
											</Box>
										</Box>
									))
								) : (
									<Typography mt={1}>No reviews available</Typography>
								)}
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box
								sx={{
									bgcolor: "#fff",
									p: 3,
									borderRadius: 3,
									mt: 5,
									boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
								}}
							>
								<Typography
									variant="h6"
									sx={{
										mb: 0.5,
										fontSize: 36,
										fontWeight: 700,
										color: "#FF3158",
									}}
								>
									{content.cost ? `Rs. ${content.cost}` : "Free"}
								</Typography>
								<Typography
									variant="h6"
									sx={{
										mb: 2,
										fontSize: 22,
										fontWeight: 700,
										color: "#001920",
									}}
								>
									Class Features
								</Typography>
								<List>
									{[
										"Detailed Explanation",
										"PDF Material",
										"Quiz Practice",
										"Youtube Tutorials",
									].map((item, i) => (
										<ListItem key={i}>
											<ListItemIcon>
												<CheckCircleOutlineOutlined sx={{ color: "red" }} />
											</ListItemIcon>
											<ListItemText primary={item} />
										</ListItem>
									))}
								</List>
							</Box>
							<Box
								sx={{
									bgcolor: "#fff",
									p: 3,
									borderRadius: 3,
									mt: 2,
									boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
								}}
							>
								<Typography
									variant="h6"
									sx={{
										mb: 2,
										fontSize: 22,
										fontWeight: 700,
										color: "#001920",
									}}
								>
									Free Quizzes
								</Typography>
								{quizzes ? (
									<List>
										{quizzes.map((item) => (
											<ListItem
												key={item.key}
												secondaryAction={
													<Link
														href={
															item.mode === "offline"
																? {
																		pathname: `/classes/offquiz/${item.key}`,
																		query: { selectedClass, subject },
																  }
																: {
																		pathname: `/classes/quiz/${item.key}`,
																		query: { selectedClass, subject },
																  }
														}
														style={{ textDecoration: "none", color: "inherit" }}
													>
														<IconButton
															sx={{
																bgcolor: "green",
																color: "white",
																"&:hover": { bgcolor: "green" },
															}}
															edge="end"
															aria-label="delete"
														>
															<ArrowForwardIos sx={{ color: "white" }} />
														</IconButton>
													</Link>
												}
											>
												<ListItemAvatar>
													<Avatar
														sx={{
															bgcolor: "purple",
															color: "white",
															"&:hover": { bgcolor: "green" },
														}}
													>
														<Quiz sx={{ color: "white" }} />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary={`${item.quizNumber} - ${item.quizTitle} (${item.totalQuestions} questions)`}
													secondary={`mode: ${item.mode} - duration: ${item.duration} mins`}
												/>
											</ListItem>
										))}
									</List>
								) : (
									<Typography>No quizzes available</Typography>
								)}
							</Box>
						</Grid>
					</Grid>
				) : (
					<Box
						width={"100%"}
						display={"flex"}
						justifyContent={"center"}
						alignItems={"center"}
						bgcolor={"#ffffff"}
					>
						<Box sx={{ width: { xs: "100%", sm: 400 } }}>
							<img
								src="/no_item.jpg"
								width={"100%"}
								height={350}
								style={{ objectFit: "contain", objectPosition: "center" }}
							/>
							<Typography
								textAlign={"center"}
								fontSize={16}
								my={2}
								fontWeight={"bold"}
							>
								No content available
							</Typography>
						</Box>
					</Box>
				)}
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
		<DetailsPage />
	</Suspense>
);
export default PageWrapper;
