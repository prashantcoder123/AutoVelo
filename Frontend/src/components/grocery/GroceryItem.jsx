import React from 'react'

const GroceryItem = ({ item, addToCart }) => {
    return (
        <div className='border p-3 rounded flex justify-between items-center'>
            <div>
                <h3 className='font-bold'>{item.name}</h3>
                <p>₹{item.price}</p>
            </div>

            <button
                onClick={() => addToCart(item)}
                className='bg-green-500 text-white px-3 py-1 rounded'
            >
                Add
            </button>
        </div>
    )
}

export default GroceryItem