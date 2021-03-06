import React, { useEffect, useState } from 'react';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import Card from '../Card/Card';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [card, setCard] = useState([]);
    const [UIsearchProducts, setUIsearchProducts] = useState([]);

    useEffect(() => {
        fetch('./products.json')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setUIsearchProducts(data)
            })
    }, []);
    useEffect(() => {

        if (products.length) {
            const savedCard = getStoredCart();
            const storedCard = [];
            for (const key in savedCard) {
                const addedProduct = products.find(product => product.key === key);
                if (addedProduct) {
                    const quantity = savedCard[key];
                    addedProduct.quantity = quantity;
                    storedCard.push(addedProduct);
                }

            }

            setCard(storedCard)
        }
    }, [products])

    const handleAddToCard = (product) => {
        const newCard = [...card, product];
        setCard(newCard)
        addToDb(product.key)
    };

    const handleSearch = event => {
        const searchText = event.target.value;
        const matchedProducts = products.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));
        setUIsearchProducts(matchedProducts);
        console.log(matchedProducts)

    }
    return (
        <div>
            <div className="search-field">
                <input
                    onChange={handleSearch}
                    type="text"
                    placeholder='search products' />
            </div>
            <div className='shop-container'>
                <div className="product-container">
                    {
                        UIsearchProducts.map(product => <Product
                            product={product}
                            key={product.key}
                            handleAddToCard={handleAddToCard}
                        ></Product>)
                    }
                </div>
                <div className="card">
                    <Card card={card}></Card>
                </div>
            </div>
        </div>

    );
};

export default Shop;