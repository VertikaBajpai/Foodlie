import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import { getAllProducts } from "../api";
import ProductsCard from "../components/cards/ProductsCard";
import { CircularProgress } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";

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
  justify-content: center;
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

const SearchBarWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Search = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const getFilteredProductsData = async () => {
            setLoading(true);
            try {
                const res = await getAllProducts(`search=${search}`);
                setProducts(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search to avoid too many API calls
        const delayDebounceFn = setTimeout(() => {
            getFilteredProductsData();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <Container>
            <Section>
                <Title>Search for your favorite food</Title>
                <SearchBarWrapper>
                    <TextInput
                        placeholder="Search..."
                        value={search}
                        handelChange={(e) => setSearch(e.target.value)}
                    />
                </SearchBarWrapper>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <CardWrapper>
                        {products.length === 0 ? (
                            <>
                                {search ? (
                                    <div>No products found for "{search}"</div>
                                ) : (
                                    <div>Type something to search</div>
                                )}
                            </>
                        ) : (
                            products.map((product) => (
                                <ProductsCard key={product._id} product={product} />
                            ))
                        )}
                    </CardWrapper>
                )}
            </Section>
        </Container>
    );
};

export default Search;
