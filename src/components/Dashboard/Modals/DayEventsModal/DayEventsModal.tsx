import EventShowcase from "@/src/components/Dashboard/EventShowcase";
import EventForm from "@/src/components/Dashboard/Forms/EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { eventColorStyle } from "@/src/lib/colors";
import { formatDateTime } from "@/src/lib/dateUtils";
import type { Event } from "@/src/lib/db/schema";
import { Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";
import CreateEventModal from "../CreateEventModal";

interface DayEventsModalProps {
	events: Partial<Event>[];
	currentDay: Date;
	isModalOpen: boolean;
	setIsModalOpen: (isOpen: boolean) => void;
	modalPosition: {
		top: number;
		left: number;
		width: number;
		height: number;
	} | null;
}

const DayEventsModal = ({ events, currentDay, isModalOpen, setIsModalOpen, modalPosition }: DayEventsModalProps) => {
	const [selectedEvent, setSelectedEvent] = useState<Partial<Event> | null>(null);
	const [modalState, setModalState] = useState<"edit" | "showcase" | "general">("general");

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={(open) => {
				setIsModalOpen(open);
				setSelectedEvent(null);
				setModalState("general");
			}}
		>
			<AnimatePresence>
				{isModalOpen && modalPosition && (
					<DialogContent className="p-0 bg-transparent border-none shadow-none max-w-none" noCloseButton={true}>
						<motion.div
							className="fixed inset-0 z-50 flex items-center justify-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								className="bg-white rounded-lg overflow-hidden"
								initial={modalPosition}
								animate={{
									top: `calc(50% - ${modalPosition.height / 2}px)`,
									left: "calc(50% - 12rem)",
									width: modalState !== "general" ? "60%" : "90%",
									height: "auto",
								}}
								exit={modalPosition}
								transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
							>
								{modalState === "showcase" && (
									<div className="p-6">
										<DialogHeader className="relative">
											<DialogTitle className="text-xl font-bold flex items-center">
												<ArrowLeftIcon
													className="mr-2 size-5 cursor-pointer text-muted-foreground"
													onClick={() => setModalState("general")}
												/>
												{currentDay.toLocaleDateString("en-US", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</DialogTitle>
											<DialogClose className="absolute right-0 -top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
												<Cross2Icon className="h-4 w-4" />
												<span className="sr-only">Close</span>
											</DialogClose>
										</DialogHeader>
										<div>
											<EventShowcase event={selectedEvent as Partial<Event>} />
										</div>
									</div>
								)}

								{modalState === "edit" && (
									<div className="p-6">
										<DialogHeader className="relative">
											<DialogTitle className="text-xl font-bold flex">
												<ArrowLeftIcon
													className="mr-2 size-5 cursor-pointer text-muted-foreground"
													onClick={() => setModalState("general")}
												/>
												{currentDay.toLocaleDateString("en-US", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</DialogTitle>
											<DialogClose className="absolute right-0 -top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
												<Cross2Icon className="h-4 w-4" />
												<span className="sr-only">Close</span>
											</DialogClose>
										</DialogHeader>
										<div>
											<EventForm mode="edit" event={selectedEvent} />
										</div>
									</div>
								)}
								{modalState === "general" && (
									<div className="p-6">
										<DialogHeader className="relative">
											<DialogTitle className="text-xl font-bold">
												{currentDay.toLocaleDateString("en-US", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</DialogTitle>
											<DialogClose className="absolute right-0 -top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
												<Cross2Icon className="h-4 w-4" />
												<span className="sr-only">Close</span>
											</DialogClose>
										</DialogHeader>
										<div className="mt-4">
											<h3 className="font-semibold mb-2">Events:</h3>
											{events.length > 0 ? (
												<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
													{events.map((event) => (
														<Card
															key={event.id}
															className="overflow-hidden relative cursor-pointer border"
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																setSelectedEvent(event);
																setModalState("showcase");
															}}
														>
															<div className="absolute p-px z-10 w-full h-full border-2 border-white pointer-events-none rounded-xl" />
															<div className="absolute top-0 right-0 z-0">
																<div
																	className="size-20 blur-2xl"
																	style={{
																		backgroundColor:
																			eventColorStyle[event.color as keyof typeof eventColorStyle].backgroundColor,
																	}}
																/>
															</div>
															<CardHeader className="p-4 relative z-10">
																<div className="flex justify-between items-start">
																	<CardTitle className="text-sm font-medium leading-none truncate pr-6">
																		{event.title}
																	</CardTitle>
																	<button
																		type="button"
																		className="text-gray-500 hover:text-gray-700 transition-colors"
																		onClick={(e) => {
																			e.preventDefault();
																			e.stopPropagation();
																			setSelectedEvent(event);
																			setModalState("edit");
																		}}
																	>
																		<Pencil1Icon className="h-4 w-4" />
																	</button>
																</div>
															</CardHeader>
															<CardContent className="p-4 pt-0 relative z-10">
																<p className="text-xs text-muted-foreground mb-2 line-clamp-2 max-h-[100px]">
																	{event.description}
																</p>
																<p className="text-xs text-muted-foreground">
																	{formatDateTime(event.initialDate?.toISOString() || "")} -
																	{formatDateTime(event.finalDate?.toISOString() || "")}
																</p>
																{/* ... (rest of the event details) */}
															</CardContent>
														</Card>
													))}
												</div>
											) : (
												<p className="text-sm text-muted-foreground">No events for this day.</p>
											)}
										</div>
									</div>
								)}
							</motion.div>
						</motion.div>
					</DialogContent>
				)}
			</AnimatePresence>
		</Dialog>
	);
};

export default DayEventsModal;
