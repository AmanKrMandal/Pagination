import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import { Row } from "react-bootstrap";

const App = () => {
  const [products, setProducts] = useState([]);
  const [textTyping, setTextTyping] = useState("");
  const [search, setSearch] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(4);

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

  // Search-----------------------------------------------------------------------------------
  useEffect(() => {
    if (textTyping) {
      const someData = products.filter((product) => {
        return Object.values(product)
          .join("")
          .toLowerCase()
          .includes(textTyping.toLowerCase());
      });
      setSearch(someData);
    } else {
      setSearch(products); // Reset to all products if there's no search term
    }
    setCurrentPage(1); // Reset to page 1 when search is applied
  }, [products, textTyping]);

  // Calculate the total number of pages for the current list (either search or full list)
  const totalPages = Math.ceil(search.length / productsPerPage);

  // Get the current products for the page, either search results or full list
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = search.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle next and prev page navigation
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Create the pagination items
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container style={{ marginTop: "20px" }}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={textTyping}
          onChange={(e) => setTextTyping(e.target.value)}
        />
      </div>
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
            onClick={() => paginate(number)}
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
