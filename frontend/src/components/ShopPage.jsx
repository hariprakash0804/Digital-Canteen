import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShopPage = () => {
    const { shopName } = useParams();
    const [shopData, setShopData] = useState([]);
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [message, setMessage] = useState("");
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]); // Store report data

    // Fetch shop data
    useEffect(() => {
        fetchShopData();
    }, [shopName]);

    const fetchShopData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/shop-details?shopName=${shopName}`);
            const data = await response.json();
            setShopData(data);
        } catch (error) {
            console.error("Error fetching shop details:", error);
        }
    };

    // Handle adding a new product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!productName || !quantity || !price) {
            setMessage("All fields are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/add-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shopName, productName, quantity, price }),
            });

            const data = await response.json();
            setMessage(data.message);

            // Refresh the shop data to show the new product
            if (data.success) {
                fetchShopData();
                setProductName("");
                setQuantity("");
                setPrice("");
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${shopName}`);
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders(); // Fetch orders when component loads

        // Polling: Fetch new orders every 3 seconds
        const interval = setInterval(fetchOrders, 3000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, [shopName]);

    const generateReport = async () => {
        const month = prompt("Enter Month (1-12):");
        const year = prompt("Enter Year (YYYY):");

        if (!month || !year || isNaN(month) || isNaN(year)) {
            alert("Invalid month or year.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/orders/report?shopName=${shopName}&month=${month}&year=${year}`);
            const data = await response.json();
            setFilteredOrders(data);
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    const handleDeliver = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/deliver/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
    
            if (response.ok) {
                // Remove from UI since it is now marked as delivered in DB
                setOrders(orders.filter(order => order._id !== orderId));
            } else {
                console.error("Failed to mark order as delivered");
            }
        } catch (error) {
            console.error("Error delivering order:", error);
        }
    };
    
    
    // const handleCancel = async (orderId) => {
    //     try {
    //         await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
    //             method: "DELETE",
    //         });
    //         setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
    //     } catch (error) {
    //         console.error("Error cancelling order:", error);
    //     }
    // };



//     return (
//         <div>
//             <h2>Welcome to {shopName}</h2>

//             {/* Add Product Form */}
//             <h3>Add a Product</h3>
//             <form onSubmit={handleAddProduct}>
//                 <input
//                     type="text"
//                     placeholder="Product Name"
//                     value={productName}
//                     onChange={(e) => setProductName(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="number"
//                     placeholder="Quantity"
//                     value={quantity}
//                     onChange={(e) => setQuantity(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="number"
//                     placeholder="Price"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Add Product</button>
//             </form>
//             {message && <p>{message}</p>}

//             {/* Display Shop Products */}
//             <h3>Shop Inventory</h3>
//             <ul>
//                 {shopData.length > 0 ? (
//                     shopData.map((item, index) => (
//                         <li key={index}>
//                             <strong>{item.productName}</strong> - {item.quantity} available at ₹{item.price}
//                         </li>
//                     ))
//                 ) : (
//                     <p>No products available</p>
//                 )}
//             </ul>


//             <div>
//         <h2>Shop Orders</h2>
//         <table border="1">
//             <thead>
//                 <tr>
//                     <th>Order ID</th>
//                     <th>UserID</th>
//                     <th>Product Name</th>
//                     <th>Quantity</th>
//                     <th>Total Amount</th>
//                     <th>Timestamp</th>
//                     <th>Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//     {orders.map(order => (
//         <tr key={order._id}>
//             <td>{order.orderId}</td>
//             <td>{order.userID}</td>
//             <td>{order.productName}</td>
//             <td>{order.quantity}</td>
//             <td>{order.totalAmount}</td>
//             <td>{new Date(order.timestamp).toLocaleString()}</td>
//             <td>
//                 <button onClick={() => handleDeliver(order._id)}>Deliver</button>
//                 {/* <button onClick={() => handleCancel(order._id)}>Cancel</button> */}
//             </td>
//         </tr>
//     ))}
// </tbody>

//         </table>
//     </div>


//         <div>
//                     <h2>Report for {shopName}</h2>
//                     <table border="1">
//                         <thead>
//                             <tr>
//                                 <th>Order ID</th>
//                                 <th>UserID</th>
//                                 <th>Product Name</th>
//                                 <th>Quantity</th>
//                                 <th>Total Amount</th>
//                                 <th>Timestamp</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredOrders.map(order => (
//                                 <tr key={order._id}>
//                                     <td>{order.orderId}</td>
//                                     <td>{order.userID}</td>
//                                     <td>{order.productName}</td>
//                                     <td>{order.quantity}</td>
//                                     <td>{order.totalAmount}</td>
//                                     <td>{new Date(order.timestamp).toLocaleString()}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
        
//         </div>
//     );

return (
    <div className="mx-auto max-w-5xl p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6">Welcome to <span className="text-orange-600">{shopName}</span></h2>

        {/* Add Product Form */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add a Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                    Add Product
                </button>
            </form>
            {message && <p className="text-green-600 mt-2">{message}</p>}
        </div>

        {/* Shop Inventory */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shop Inventory</h3>
            {shopData.length > 0 ? (
                <ul className="space-y-2">
                    {shopData.map((item, index) => (
                        <li key={index} className="p-2 border-b border-gray-300">
                            <strong className="text-indigo-700">{item.productName}</strong> - 
                            <span className="text-gray-700"> {item.quantity} available at ₹{item.price}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No products available</p>
            )}
        </div>

        {/* Shop Orders */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shop Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 border">Order ID</th>
                            <th className="p-3 border">UserID</th>
                            <th className="p-3 border">Product Name</th>
                            <th className="p-3 border">Quantity</th>
                            <th className="p-3 border">Total Amount</th>
                            <th className="p-3 border">Timestamp</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} className="text-center border-b">
                                <td className="p-3 border">{order.orderId}</td>
                                <td className="p-3 border">{order.userID}</td>
                                <td className="p-3 border">{order.productName}</td>
                                <td className="p-3 border">{order.quantity}</td>
                                <td className="p-3 border">₹{order.totalAmount}</td>
                                <td className="p-3 border">{new Date(order.timestamp).toLocaleString()}</td>
                                <td className="p-3 border">
                                    <button
                                        onClick={() => handleDeliver(order._id)}
                                        className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    >
                                        Deliver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Report Section */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report for {shopName}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 border">Order ID</th>
                            <th className="p-3 border">UserID</th>
                            <th className="p-3 border">Product Name</th>
                            <th className="p-3 border">Quantity</th>
                            <th className="p-3 border">Total Amount</th>
                            <th className="p-3 border">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order._id} className="text-center border-b">
                                <td className="p-3 border">{order.orderId}</td>
                                <td className="p-3 border">{order.userID}</td>
                                <td className="p-3 border">{order.productName}</td>
                                <td className="p-3 border">{order.quantity}</td>
                                <td className="p-3 border">₹{order.totalAmount}</td>
                                <td className="p-3 border">{new Date(order.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

};

export default ShopPage;
