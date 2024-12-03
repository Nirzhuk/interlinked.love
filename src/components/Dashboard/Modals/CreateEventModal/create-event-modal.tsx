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
			<DialogContent noCloseButton={true} className="w-[78vw] h-full overflow-scroll max-w-none" isRounded={false}>
				<div>
					<DialogHeader>
						<DialogTitle>Create New Event</DialogTitle>
					</DialogHeader>

					<EventForm mode="create" />
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CreateEventModal;
