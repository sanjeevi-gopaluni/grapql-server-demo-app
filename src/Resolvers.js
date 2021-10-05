const { PubSub } = require('graphql-subscriptions');
const PRODUCT_UPSERT_TOPIC = 'productUpserted';
const PRODUCT_DELETE_TOPIC = 'productDeleted';
const pubsub = new PubSub();
const db = {
    users: [{ name: 'Satya' }, { name: 'Sanjeevi' }, { name: 'AntMan' }],
    products: [{ itemKey: 334475, "desc": "Pallet Jack Truck 21*42 ", "price": "$1426.95", "variants": ['red', 'blue', 'yellow', 'green'] },
    { itemKey: 32276525, "desc": "House Hold Table", "customCut": true, "price": 12.35, "variants": ['green'] },
    { itemKey: 123454, "desc": "Disposable Face Mask, 2 ply", "customCut": false, "price": 2.35, "variants": ['blue', 'white', 'black'] },
    { itemKey: 7878787, "desc": "Laptop mouse", "customCut": false, "price": 12.35, "variants": ['green', 'white'] }
    ]
};
const resolvers = {
    Query: {
        users: () => {
            const { users } = db;
            return users;
        },
        products: (root, args, context, info) => {
            const { products } = db;
            return products;
        },
        productsByItemKey: (args) => {
            const { products } = db;
            // let res = products.filter(prd=>prd.itemKey==args.itemKey)
            let index = -1;
            let res = db.products.filter((prd, i) => { if (prd.itemKey == args.itemKey) { index = i; return prd } })
            return index >= 0 ? db.products[index] : {};
        }
    },
    Mutation: {
        createUser: ({ name }) => {
            const user = { name };
            db.users.push(user);
            return user;
        },
        updateProduct: (root,args) => {
            let { itemKey, desc, price, customCut, image, variants } =args;
            let index = -1;
            let product = { itemKey, desc, price, customCut, image, variants };
            let res = db.products.filter((prd, i) => { if (prd.itemKey == itemKey) { index = i; return prd } })
            if (index >= 0) {
                db.products[index] = product;
            } else {
                db.products.push(product);
            }
            pubsub.publish('productUpserted', {productUpserted:product});
            return product;
        },
        deleteProductByItemKey: (root,args) => {
            let { itemKey } =args;
            let index = -1;
            let prd = {};
            let res = db.products.filter((prd, i) => { if (prd.itemKey == itemKey) { index = i; return prd } })
            let { products } = db;
            if (index >= 0) {
                prd = products[index];
                products.splice(index, 1);
            }
            let dto = { status: (index >= 0) ? true : false, "products": products }
            pubsub.publish(PRODUCT_DELETE_TOPIC, {productDeleted:prd});
            db.products = products;
            return dto;
        }
    },
    Subscription: {
        productUpserted: {
            subscribe: () => {
                return pubsub.asyncIterator(PRODUCT_UPSERT_TOPIC);
            }
        },
        productDeleted: {
            subscribe: () => { return pubsub.asyncIterator([PRODUCT_DELETE_TOPIC]) }
        }
    }
};
module.exports = { resolvers }