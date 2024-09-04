import React, { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import { Row } from "react-bootstrap";

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(products.length / productsPerPage),
    [products.length]
  );

  // Get current products for the page using memoization
  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return products.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [currentPage, products]);

  // Pagination navigation handlers
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Create page numbers only when products or pagination changes
  const pageNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [totalPages]);

  return (
    <Container>
      <Row>
        {currentProducts.map((product) => (
          <Col style={{ marginBottom: "20px" }} md={4} lg={3} key={product.id}>
            <Card className="h-100 d-flex flex-column">
              <Card.Img
                style={{ height: "300px" }}
                variant="top"
                src={product.image}
                alt={product.title}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.title.substring(0, 10)}</Card.Title>
                <Card.Text>{product.description.substring(0, 10)}...</Card.Text>
                <Button variant="primary" className="mt-auto">
                  Go somewhere
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
};

export default App;
