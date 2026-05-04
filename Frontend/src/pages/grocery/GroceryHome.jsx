import React, { useState } from 'react'
import GroceryItem from '../../components/grocery/GroceryItem'

const GroceryHome = () => {

    const products = [
        { id: 1, name: 'Milk', price: 50 },
        { id: 2, name: 'Bread', price: 30 },
        { id: 3, name: 'Rice', price: 80 },
        { id: 4, name: 'Eggs', price: 60 }
    ]

    const [cart, setCart] = useState([])

    const addToCart = (item) => {
        setCart([...cart, item])
    }

    return (
        <div className='p-5'>

            <h1 className='text-2xl font-bold mb-4'>Grocery Store</h1>

            <div className='flex flex-col gap-3'>
                {products.map((item) => (
                    <GroceryItem key={item.id} item={item} addToCart={addToCart} />
                ))}
            </div>

            <div className='mt-5 p-3 bg-gray-100 rounded'>
                <h2 className='font-bold'>Cart: {cart.length} items</h2>
            </div>

        </div>
    )
}

export default GroceryHome