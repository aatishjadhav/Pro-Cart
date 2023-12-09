// PlaceOrderScreen.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
} from "react-bootstrap";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { applyCoupon, removeCoupon } from "../slices/couponSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const appliedCoupon = useSelector((state) => state.coupon.appliedCoupon);

  const [couponCode, setCouponCode] = useState("");

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [coupons, setCoupons] = useState([
    { code: "SAVE10", discount: 10 },
    { code: "FREESHIP", discount: 5 },
    // Add more coupons as needed
  ]);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const coupon = appliedCoupon;
      const discount = coupon ? coupon.discount : 0;

      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice - discount,
      }).unwrap();

      dispatch(clearCartItems());
      dispatch(removeCoupon());
      navigate(`/order/${res._id}`);
      console.log("Order placed successfully");

    } catch (error) {
      toast.error(error);
    }
  };

  const applyCouponHandler = (couponCode) => {
    const coupon = coupons.find((c) => c.code === couponCode);

    if (coupon) {
      dispatch(applyCoupon(coupon));
      toast.success(`Coupon "${coupon.code}" applied!`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* Add Coupon Discount Section */}
              {appliedCoupon && (
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Applied Coupon:</strong>
                      {appliedCoupon.code}
                    </Col>
                    <Col>- ${appliedCoupon.discount}</Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  {/* Adjust the total price based on the coupon */}
                  <Col>
                    $
                    {cart.totalPrice -
                      (appliedCoupon ? appliedCoupon.discount : 0)}
                  </Col>
                </Row>
              </ListGroup.Item>

              {/* ... (unchanged code) */}

              {/* Display Available Coupons */}
              <ListGroup.Item>
                <h2>Available Coupons</h2>
                <Form>
                  <Form.Group controlId="couponCode">
                    <Form.Control
                      type="text"
                      placeholder="Enter coupon code"
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    type="button"
                    onClick={() => applyCouponHandler(couponCode)}
                  >
                    Apply Coupon
                  </Button>
                </Form>
                <ListGroup>
                  {coupons.map((coupon) => (
                    <ListGroup.Item key={coupon.code}>
                      <strong>{coupon.code}</strong> - {coupon.discount}% off
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>

              {/* ... (unchanged code) */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
