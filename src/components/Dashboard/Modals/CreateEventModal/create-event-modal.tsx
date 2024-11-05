"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from "../../Forms/EventForm";

interface CreateEventModalProps {
	isOpen: boolean;
	onChange: (state: boolean) => void;
}

const CreateEventModal = ({ isOpen, onChange }: CreateEventModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent
				noCloseButton={false}
				className="w-full sm:max-w-3xl bg-background dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
			>
				<DialogHeader>
					<DialogTitle>Create New Event</DialogTitle>
				</DialogHeader>
				<EventForm mode="create" />
			</DialogContent>
		</Dialog>
	);
};

export default CreateEventModal;
