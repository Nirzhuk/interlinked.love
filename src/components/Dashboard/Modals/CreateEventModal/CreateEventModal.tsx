"use client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import EventForm from "../../Forms/EventForm";

interface CreateEventModalProps {
	isOpen: boolean;
	onChange: (state: boolean) => void;
}

const CreateEventModal = ({ isOpen, onChange }: CreateEventModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Event</DialogTitle>
				</DialogHeader>
				<EventForm mode="create" />
			</DialogContent>
		</Dialog>
	);
};

export default CreateEventModal;
