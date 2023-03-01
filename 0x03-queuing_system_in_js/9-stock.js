import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;
const client = redis.createClient();
const redisGet = promisify(client.get).bind(client);


const listProducts = [
    {
        Id: 1, 
        name: 'Suitcase 250',
        price: 50,
        stock: 4,
    },
    {
        Id: 2, 
        name: 'Suitcase 450',
        price: 100,
        stock: 10,
    },
    {
        Id: 3, 
        name: 'Suitcase 650',
        price: 350,
        stock: 2,
    },
    {
        Id: 4, 
        name: 'Suitcase 1050',
        price: 550,
        stock: 5,
    },
];

function getItemById(id) {
    return listProducts.filter((product) => product.id === id)[0];
}

client.on('error', (error) => {
    console.log(`Redis client not connected to the server: ${error.message}`);
});

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

app.get('/list_products', (req, res) => {
    res.json(listProducts)
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function reserveStockById(itemId, stock) {
    client.set(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
    const stock = await redisGet(`item.${itemId}`)
    return stock
}

app.get('/list_products/:itemId', async (req, res) => {
    const itemId = Number(req.params.itemId);
    const item = getItemById(itemId);

    if (!item) {
        res.json({"status":"Product not found"})
        return
    }

    // check if stock exists in redis and set current quantity to current stock
    // else the current quantity is the initial available quantity
    const currentStock = await getCurrentReservedStockById(itemId)
    if (!currentStock) {
        await reserveStockById(itemId, item.initialAvailableQuantity);
        item.currentQuantity = item.initialAvailableQuantity;
    } else {
        item.currentQuantity = currentStock;
    }
    res.json(item);
});

app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = Number(req.params.itemId);
    // search item by itemId
    const item = getItemById(itemId);
    //If the item does not exist, it should return
    if (!item) {
        res.json({"status":"Product not found"})
        return
    }

    let currentStock = await getCurrentReservedStockById(itemId);
    if (currentStock === null ) {
        currentStock = item.initialAvailableQuantity
    }
    //If the item exists, it should check that there is at least one stock available. If not it should return
    if (currentStock <= 0) {
        res.json({status:"Not enough stock available", itemId})
        return
    }
    //If there is enough stock available, it should reserve one item(by using reserveStockById), and return
    reserveStockById(itemId, Number(currentStock) - 1);
    res.json({status:"Reservation confirmed", itemId});
});
