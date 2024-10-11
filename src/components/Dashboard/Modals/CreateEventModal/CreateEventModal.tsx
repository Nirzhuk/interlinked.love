"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import EventForm from "../../Forms/EventForm";

interface CreateEventModalProps {
	isOpen: boolean;
	onChange: (state: boolean) => void;
}

const CreateEventModal = ({ isOpen, onChange }: CreateEventModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent className="max-w-[40%]">
				<DialogHeader>
					<DialogTitle>Create New Event</DialogTitle>
				</DialogHeader>
				<EventForm mode="create" event={null} />
			</DialogContent>
		</Dialog>
	);
};

export default CreateEventModal;
