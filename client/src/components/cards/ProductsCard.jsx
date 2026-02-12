import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CircularProgress, Rating } from "@mui/material";
import {
  AddShoppingCartOutlined,
  FavoriteBorder,
  FavoriteRounded,
  ShoppingBagOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
  addToCart,
} from "../../api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/reducers/SnackbarSlice";

const Card = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  @media (max-width: 600px) {
    width: 180px;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 300px;
  border-radius: 6px;
  object-fit: cover;
  transition: all 0.3s ease-out;
  @media (max-width: 600px) {
    height: 180px;
  }
`;
const Menu = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  top: 14px;
  right: 14px;
  display: none;
  flex-direction: column;
  gap: 12px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease-out;
  &:hover {
    background-color: ${({ theme }) => theme.black};
  }

  &:hover ${Image} {
    opacity: 0.9;
  }
  &:hover ${Menu} {
    display: flex;
  }
`;
const MenuItem = styled.div`
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;
const Rate = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  bottom: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  opacity: 0.9;
`;
const Details = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: column;
  padding: 4px 10px;
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  white-space: normal;
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Percent = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: green;
`;
const Span = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;

const ProductsCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const addFavourite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) {
      setFavoriteLoading(false);
      dispatch(
        openSnackbar({
          message: "Please login to add to favorites",
          severity: "error",
        })
      );
      return;
    }
    try {
      await addToFavourite(token, { productId: product?._id });
      setFavorite(true);
      dispatch(
        openSnackbar({
          message: "Added to favorites",
          severity: "success",
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || "Failed to add to favorites",
          severity: "error",
        })
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const removeFavourite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) {
      setFavoriteLoading(false);
      return;
    }
    try {
      await deleteFromFavourite(token, { productId: product?._id });
      setFavorite(false);
      dispatch(
        openSnackbar({
          message: "Removed from favorites",
          severity: "success",
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || "Failed to remove from favorites",
          severity: "error",
        })
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const checkFavorite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) {
      setFavoriteLoading(false);
      return;
    }
    try {
      const res = await getFavourite(token, { productId: product?._id });
      const isFavorite = res.data?.some(
        (favorite) => favorite._id === product?._id
      );
      setFavorite(isFavorite);
    } catch (err) {
      console.log(err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const addCart = async (id) => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) {
      dispatch(
        openSnackbar({
          message: "Please login to add items to cart",
          severity: "error",
        })
      );
      return;
    }
    try {
      await addToCart(token, { productId: id, quantity: 1 });
      dispatch(
        openSnackbar({
          message: "Item added to cart successfully",
          severity: "success",
        })
      );
      navigate("/cart");
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || "Failed to add item to cart",
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    checkFavorite();
  }, [favorite]);
  return (
    <Card>
      <Top onClick={() => navigate(`/dishes/${product?._id}`)}>
        <Image src={product?.img} />
        <Menu>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              favorite ? removeFavourite() : addFavourite();
            }}
          >
            {favoriteLoading ? (
              <>
                <CircularProgress sx={{ fontSize: "20px" }} />
              </>
            ) : (
              <>
                {favorite ? (
                  <FavoriteRounded sx={{ fontSize: "20px", color: "red" }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: "20px" }} />
                )}
              </>
            )}
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              addCart(product?._id);
            }}
          >
            <ShoppingBagOutlined sx={{ fontSize: "20px" }} />
          </MenuItem>
        </Menu>
        <Rate>
          <Rating value={3.5} sx={{ fontSize: "14px" }} />
        </Rate>
      </Top>
      <Details onClick={() => navigate(`/dishes/${product._id}`)}>
        <Title>{product?.name}</Title>
        <Desc>{product?.desc}</Desc>
        <Price>
          ${product?.price?.org} <Span>${product?.price?.mrp}</Span>
          <Percent> (${product?.price?.off}% Off) </Percent>
        </Price>
      </Details>
    </Card>
  );
};

export default ProductsCard;
