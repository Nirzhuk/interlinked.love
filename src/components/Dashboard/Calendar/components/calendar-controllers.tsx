"use client";

import { Button } from "@/components/ui/button";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import React, { useMemo, useState, useCallback } from "react";

interface ControllersCalendarProps {
	currentDate: Date;
	prevMonth: () => void;
	nextMonth: () => void;
	setIsCreateModalOpen: (open: boolean) => void;
}

const CalendarControllers = ({ currentDate, prevMonth, nextMonth, setIsCreateModalOpen }: ControllersCalendarProps) => {
	return (
		<section className="flex items-center justify-between w-full md:w-[50rem]">
			<h2 className="text-2xl font-bold mr-4 relative h-10 overflow-hidden">
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.p
						key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						<span>{currentDate.toLocaleString("en-US", { month: "long" })}</span>
						<span className="text-purple-500 ml-2">{currentDate.getFullYear()}</span>
					</motion.p>
				</AnimatePresence>
			</h2>
			<div className="flex items-center justify-between sm:flex-row flex-col-reverse gap-2">
				<div className="flex">
					<Button onClick={prevMonth} variant="ghost" size="icon" className="mr-2">
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button onClick={nextMonth} variant="ghost" size="icon">
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
				<div className="flex justify-end">
					<Button onClick={() => setIsCreateModalOpen(true)} variant="outline">
						<Plus className="mr-2 h-4 w-4" /> New Event
					</Button>
				</div>
			</div>
		</section>
	);
};

export default CalendarControllers;
