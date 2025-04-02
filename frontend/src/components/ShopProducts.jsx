import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ShopProducts = () => {
    const { shopName } = useParams();
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [selectedQuantity, setSelectedQuantity] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${shopName}`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [shopName]);

    const handleQuantityChange = (productId, value) => {
        let newValue = value.replace(/^0+/, ""); // ✅ Remove leading zeros
        setQuantities((prev) => ({
            ...prev,
            [productId]: newValue, // ✅ Store quantity for each product
        }));
    };

    const addToCart = (product) => {
        let quantity = Number(quantities[product._id] || 1); // ✅ Default to 1 if empty

        if (quantity <= 0 || isNaN(quantity)) {
            alert("Please enter a valid quantity!");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if the product already exists in the cart
        const existingItem = cart.find((item) => item._id === product._id);

        if (existingItem) {
            existingItem.quantity += quantity; // ✅ Correctly add entered quantity
        } else {
            cart.push({ ...product, quantity }); // ✅ Store exact quantity
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("✅ Product added to cart successfully!");

        setQuantities((prev) => ({ ...prev, [product._id]: "" })); // ✅ Clear input only for this product
    };



//     return (
//         <div className="mx-10 my-10 p-6">
//             <h2 className="text-3xl font-bold text-indigo-800 mb-6">Products in <span className="text-orange-600">{shopName}</span></h2>
//             {products.length === 0 ? (
//                 <p className="text-gray-600 text-lg">No products available.</p>
//             ) : (
//                 <table border="1" className="">
//                     <thead className="">
//                         <tr>
//                             <th className="py-3 px-1 text-left">Product Name</th>
//                             <th className="py-3 px-1 text-left">Quantity</th>
//                             <th className="py-3 px-1 text-left">Price</th>
//                             <th className="py-3 px-1 text-center">Add to Cart</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products.map((product) => (
//                             <tr key={product._id}>
//                                 <td className="py-3 px-1">{product.productName}</td>
//                                 <td className="py-3 px-1">{product.quantity}</td>
//                                 <td className="py-3 px-1">${product.price}</td>
//                                 <td className="py-3 px-1">
//                                     <input
//                                         type="number"
//                                         min="1"
//                                         value={quantities[product._id] || ""}
//                                         onChange={(e) => handleQuantityChange(product._id, e.target.value)}
//                                         placeholder="Enter quantity"
//                                     />
//                                     <button onClick={() => addToCart(product)}>Add to Cart</button>

//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}

//             <Link to="/dashboard">
//                 <button>Back to Shops</button>
//             </Link>
//             <Link to="/cart">
//                 <button>Go to Cart 🛒</button>
//             </Link>
//         </div>
//     );
// };



return (
    <div className="mx-10 my-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6">
            Products in <span className="text-orange-600">{shopName}</span>
        </h2>

        {products.length === 0 ? (
            <p className="text-gray-600 text-lg">No products available.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="text-black">
                        <tr>
                            <th className="py-3 px-4 text-left">Product Name</th>
                            <th className="py-3 px-4 text-left">Quantity</th>
                            <th className="py-3 px-4 text-left">Price</th>
                            <th className="py-3 px-4 text-center">Add to Cart</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-b text-indigo-800 font-semibold">
                                <td className="py-3 px-4">{product.productName}</td>
                                <td className="py-3 px-4">{product.quantity}</td>
                                <td className="py-3 px-4">Rs.{product.price}</td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex items-center gap-2 justify-center">
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[product._id] || ""}
                                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                            placeholder="Qty"
                                            className="w-16 px-2 py-1 border border-indigo-700 rounded-md text-indigo-800"
                                        />
                                        <button 
                                            onClick={() => addToCart(product)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        <div className="mt-6 flex gap-4">
            <Link to="/dashboard">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                    Back to Shops
                </button>
            </Link>
            <Link to="/cart">
                <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
                    Go to Cart 🛒
                </button>
            </Link>
        </div>
    </div>
);
}

export default ShopProducts;
