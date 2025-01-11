import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				"Please enter a valid email address",
			],
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
			required: true,
		},
		providersId: {
			type: String,
			required: false,
			default: null,
		},
		image: {
			type: String,
			required: false,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId, // Reference to a User
			ref: "User",
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5, // Assuming ratings are on a 1-5 scale
		},
		comment: {
			type: String,
			required: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false } // Optional: prevent creation of a separate _id for each review
);

const productSchema = new mongoose.Schema(
	{
		itemName: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: [String],
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: false,
			default: 0,
		},
		discount: {
			type: Number,
			required: false,
			default: 0,
		},
		stock: {
			type: Number,
			required: true,
			default: 0,
		},
		comments: {
			type: [String],
			required: false,
			default: [],
		},
		brand: {
			type: String,
			required: true,
			default: null,
		},
		reviews: {
			type: [reviewSchema], // Use the subschema here
			required: false,
			default: [],
		},
		sku: {
			type: String,
			required: false,
			unique: true,
		},
		tags: {
			type: [String],
			required: true,
			default: [],
		},
		variants: [
			{
				color: String,
				size: String,
				price: Number, // Optional: Override base price for specific variants
				stock: Number,
			},
		],
		isFeatured: {
			type: Boolean,
			required: false,
			default: false,
		},
		available: {
			type: Boolean,
			required: false,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

const cartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "Product",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	totalPrice: {
		type: Number,
		required: true,
	},
});

const User = mongoose.models.User || mongoose.model("User", authSchema);
const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export { User, Product, Cart };