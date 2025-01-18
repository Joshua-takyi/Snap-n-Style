import PropTypes from "prop-types";

export const SecondaryButton = ({ children, className }) => {
	return (
		<button
			className={`bg-secondary-DEFAULT text-text-DEFAULT px-4 py-2 rounded-md border border-text-DEFAULT hover:bg-accent-DEFAULT/80 font-medium ${className}`}
		>
			{children}
		</button>
	);
};

SecondaryButton.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
