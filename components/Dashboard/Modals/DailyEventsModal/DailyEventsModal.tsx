"use client";
import EventShowcase from "@/components/Dashboard/EventShowcase";
import EventForm from "@/components/Dashboard/Forms/EventForm";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Event } from "@/lib/db/schema";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";
import DayEventsModalCard from "./DailyEventsModalCard";

interface DailyEventsModalProps {
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

const DailyEventsModal = ({
	events,
	currentDay,
	isModalOpen,
	setIsModalOpen,
	modalPosition,
}: DailyEventsModalProps) => {
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
					<DialogContent className="p-0 bg-transparent border-none shadow-none max-w-none">
						<motion.div
							// @ts-expect-error - error from using rcs, todo: fix
							className="fixed inset-0 z-50 flex items-center justify-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								// @ts-expect-error - error from using rcs, todo: fix
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
														<DayEventsModalCard
															key={event.id}
															event={event}
															onClickEditButton={(eve) => {
																setSelectedEvent(eve);
																setModalState("edit");
															}}
															onClick={(eve) => {
																setSelectedEvent(eve);
																setModalState("showcase");
															}}
														/>
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

export default DailyEventsModal;
