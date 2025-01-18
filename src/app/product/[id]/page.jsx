import Product from "@/components/product/proPage";
import PropTypes from "prop-types";
export default async function ProductPage({ params }) {
	const { id } = await params;
	return <Product id={id} />;
}

ProductPage.propTypes = {
	params: PropTypes.object.isRequired,
};
