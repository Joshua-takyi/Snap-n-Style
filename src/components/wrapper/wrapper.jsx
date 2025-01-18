import PropTypes from "prop-types";
export default function Wrapper({ children, className }) {
	return (
		<div className={`container mx-auto md:py-5 ${className}`}>{children}</div>
	);
}

Wrapper.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
