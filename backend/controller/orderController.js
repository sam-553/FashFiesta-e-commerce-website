import Order from '../model/ordermodel.js';
import Product from '../model/productmodel.js';
import User from '../model/usermodel.js';
import handleasyncError from '../middlewear/handleasyncError.js';
import HandleError from '../utils/handleError.js';



// Create New Order
const createNewOrder = handleasyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    }).save()
    res.status(201).json({
        success: true,
        order
    })
})
//Getting single Order
const getSingleOrder = handleasyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if (!order) {
        return next(new HandleError("No order found", 404));
    }
    res.status(200).json({
        success: true,
        order
    })
})

//All my orders
const allMyOrders = handleasyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
        return next(new HandleError("No order found", 404));
    }
    res.status(200).json({
        success: true,
        orders
    })
})

//Getting all orders
const getAllOrders = handleasyncError(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
})

//Update order status
const updateOrderStatus = handleasyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new HandleError("No order found", 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new HandleError("This order has already been delivered", 400));
    }

    const { status } = req.body;
    if (!status) {
        return next(new HandleError("Status is required", 400));
    }

    // Ensure all products exist and have sufficient stock
    for (let item of order.orderItems) {
        const product = await Product.findById(item.product);

        if (!product) {
            console.error(`Product with id ${item.product} not found for order ${order._id}`);
            return next(new HandleError(`Product with id ${item.product} not found`, 404));
        }

        if (product.stock < item.quantity) {
            return next(new HandleError(`Insufficient stock for product: ${product.name}`, 400));
        }
    }

    // Update product quantities in parallel
    await Promise.all(
        order.orderItems.map(item => updateQuantity(item.product, item.quantity))
    );

    // Update order status and deliveredAt timestamp
    order.orderStatus = status;
    if (status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order
    });
});

// Helper function to update product stock
async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);

    if (!product) {
        console.error(`Product with id ${id} not found during stock update`);
        throw new Error(`Product with id ${id} not found`);
    }

    product.stock -= quantity;

    if (product.stock < 0) {
        console.error(`Stock below zero for product ${product.name}`);
        throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    await product.save({ validateBeforeSave: false });
}




//Delete Order
const deleteOrder = handleasyncError(async (req, res, next) => {
    const { id } = req.params;
    console.log("Delete request for order ID:", id);

    // ✅ Validate ObjectId before querying

    const order = await Order.findById(id);
    if (!order) {
        return next(new HandleError("No order found", 404));
    }

    if (order.orderStatus !== 'Delivered') {
        return next(new HandleError("This order is under processing and cannot be deleted", 403));
    }

    await Order.deleteOne({ _id: id });

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});


export { createNewOrder, getSingleOrder, allMyOrders, getAllOrders, updateOrderStatus, deleteOrder }
