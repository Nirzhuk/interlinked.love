import { AnimatePresence, motion } from "framer-motion";
import type React from "react";

const FadeInView = ({ children }: { children: React.ReactElement }) => {
	return (
		<AnimatePresence>
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				transition={{ duration: 0.3 }}
				variants={{
					visible: { opacity: 1, scale: 1 },
					hidden: { opacity: 0, scale: 0 },
				}}
			>
				<div>{children}</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default FadeInView;
