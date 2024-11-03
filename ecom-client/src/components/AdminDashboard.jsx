import React, { useEffect, useState } from 'react';
import style from './css/styles.module.css';
import Sidebar from './AdminComponents/Sidebar';
import axios from "axios";

const AdminDashboard = () => {
  const [query, setQuery] = useState('');
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoryPerPage = 5;
  const url = 'http://localhost:3000/';

  const productList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}api/products`);
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        setFilteredCategory(response.data);
      } else {
        setProducts([]);
        setFilteredCategory([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Product:', error?.message);
      setProducts([]);
      setFilteredCategory([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    productList();
  }, []);

  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = products.filter(product =>
        product.title && product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategory(Array.isArray(filtered) ? filtered : []);
    }
  }, [query, products]);

  const delete_product = async (id) => {
    try {
      const response = await axios.post(`${url}api/delete`, { _id: id });
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        setFilteredCategory(response.data);
      }
    } catch (error) {
      console.error('Error fetching Product:', error?.message);
    }
  };

  const indexOfLastProduct = currentPage * categoryPerPage;
  const indexOfFirstProduct = indexOfLastProduct - categoryPerPage;
  const currentData = Array.isArray(filteredCategory)
    ? filteredCategory.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];

  const totalPages = Math.ceil((Array.isArray(filteredCategory) ? filteredCategory.length : 0) / categoryPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      {/* <Sidebar /> */}
      <div className={style.main}>
        <h1 className={style.productTitle}>Products</h1>
        <div className={style.inputContainer}>
          <input
            type="search"
            name="search"
            id="search"
            className={style.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
          />
        </div>

        <table className={style.table}>
          <thead className={style.thead}>
            <tr>
              <th className={style.th}>img</th>
              <th className={style.th}>Product Name</th>
              <th className={style.th}>Seller</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className={style.loading}>
                  Loading..
                </td>
              </tr>
            ) : (
              Array.isArray(currentData) && currentData.length > 0 ? (
                currentData.map((row, i) => (
                  <tr key={i}>
                    <td className={style.data}><img src={`${url}uploads/${row.file}`} width={40} /></td>
                    <td className={style.data}>{row.title}</td>
                    <td className={style.data}>{row.sellerName}</td>
                    <td onClick={() => delete_product(row._id)} >
                      <img src="/icons/trash.svg" alt="" width={30} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={style.noData}>No Products</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <div className={style.pagination}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={style.pageButton}
          >
            Previous
          </button>
          <span className={style.pageNumber}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={style.pageButton}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
