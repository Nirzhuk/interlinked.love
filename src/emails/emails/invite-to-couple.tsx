import { Button, Container, Img, Section, Text } from "@react-email/components";
import * as React from "react";
import EmailFooter from "../components/email-footer";
import EmailWrapper from "../components/email-wrapper";

interface InviteToCoupleEmailProps {
	inviteCode: number;
	coupleName: string;
	userName: string;
	typeOfInvite: "couple" | "group";
}

const mapTypeOfInvite: Record<InviteToCoupleEmailProps["typeOfInvite"], string> = {
	couple: "Couple",
	group: "Group",
};

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";

export const InviteToCoupleEmail = ({ inviteCode, coupleName, userName, typeOfInvite }: InviteToCoupleEmailProps) => (
	<EmailWrapper>
		<Container className="px-[12px]">
			<Section className="my-[16px]">
				<Img
					alt="Love"
					className="w-full rounded-[12px] object-cover border border-gray-300"
					height={320}
					src={`${baseUrl}/static/hearts-luv.png`}
				/>
				<Section className="mt-[32px] text-center">
					<Text className="mt-[16px] text-[18px] font-semibold leading-[28px] text-indigo-600">
						{userName} invited you to join their {mapTypeOfInvite[typeOfInvite]}
					</Text>

					<Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
						Click the button below to join {coupleName}
					</Text>

					<Button
						className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
						href={`${baseUrl}/auth/sign-up?inviteId=${inviteCode}`}
						target="_blank"
					>
						Join {mapTypeOfInvite[typeOfInvite]}
					</Button>
				</Section>
			</Section>
			<EmailFooter />
		</Container>
	</EmailWrapper>
);

InviteToCoupleEmail.PreviewProps = {
	inviteCode: 123,
	coupleName: "John & Jane",
	userName: "John",
	typeOfInvite: "couple",
} as InviteToCoupleEmailProps;

export default InviteToCoupleEmail;
