import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrders } from "../api";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;

const OrderCard = styled.div`
  width: 350px;
  padding: 18px 20px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const OrderTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
`;

const TotalAmount = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  border-top: 1px dashed ${({ theme }) => theme.text_secondary};
  padding-top: 10px;
`;

const Status = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme, status }) =>
        status === "Placed" ? theme.primary : theme.text_secondary};
  text-align: right;
`;

const DateText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Orders = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    const getMyOrders = async () => {
        setLoading(true);
        const token = localStorage.getItem("foodeli-app-token");
        try {
            const res = await getOrders(token);
            setOrders(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyOrders();
    }, []);

    return (
        <Container>
            <Section>
                <Title>Your Orders</Title>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <CardWrapper>
                        {orders.length === 0 ? (
                            <>No orders found</>
                        ) : (
                            orders.map((order) => (
                                <OrderCard key={order._id}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <OrderTitle>Order #{order._id.slice(-6)}</OrderTitle>
                                        <DateText>{new Date(order.createdAt).toLocaleDateString()}</DateText>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        {order.products.map((item) => (
                                            <OrderItem key={item.product._id}>
                                                <span>{item.product.name} x {item.quantity}</span>
                                                <span>${(item.product.price.org * item.quantity).toFixed(2)}</span>
                                            </OrderItem>
                                        ))}
                                    </div>

                                    <TotalAmount>
                                        <span>Total Amount:</span>
                                        <span>${order.total_amount}</span>
                                    </TotalAmount>

                                    <Status status="Placed">Status: Placed</Status>
                                </OrderCard>
                            ))
                        )}
                    </CardWrapper>
                )}
            </Section>
        </Container>
    );
};

export default Orders;
