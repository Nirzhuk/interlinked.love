import { Column, Hr, Img, Link, Row, Section, Text } from "@react-email/components";
import type React from "react";
const EmailFooter = () => {
	return (
		<Section className="text-center">
			<Hr className="my-[16px] border-t-2 border-gray-300" />
			<table className="w-full">
				<tr className="w-full">
					<td align="center">
						<Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">Interlinked.love</Text>
					</td>
				</tr>
				<tr>
					<td align="center">
						<Row className="table-cell h-[44px] w-[56px] align-bottom">
							<Column className="pr-[8px]">
								<Link href="#">
									<Img alt="Facebook" height="36" src="https://react.email/static/facebook-logo.png" width="36" />
								</Link>
							</Column>
							<Column className="pr-[8px]">
								<Link href="#">
									<Img alt="X" height="36" src="https://react.email/static/x-logo.png" width="36" />
								</Link>
							</Column>
							<Column>
								<Link href="#">
									<Img alt="Instagram" height="36" src="https://react.email/static/instagram-logo.png" width="36" />
								</Link>
							</Column>
						</Row>
					</td>
				</tr>
			</table>
		</Section>
	);
};

export default EmailFooter;
