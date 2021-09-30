const express = require('express');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');
var cors = require('cors')
const app = new express();
const db = {
  users: [{ name: 'Satya' }, { name: 'Sanjeevi' }, { name: 'AntMan' }],
  products:[{itemKey:334475,"desc":"Pallet Jack"},{itemKey:32276525,"desc":"Wrench  Set","customCut":true,"price":12.35}]
};

const resolvers = {
  users: () => {
    const { users } = db;
    return users;
  },
  products: (root,args,context,info) =>{
    
    const {products} = db;
    return products;
  },
  productsByItemKey:(args)=>{
    const {products} = db;
    // let res = products.filter(prd=>prd.itemKey==args.itemKey)
    let index = -1;
    let res = db.products.filter((prd,i)=> {if(prd.itemKey==args.itemKey){index=i;return prd}})
    return index>=0?db.products[index]:{};
  },
  createUser: ({ name }) => {
    const user = { name };
    db.users.push(user);
    return user;
  },
  updateProduct: ({itemKey,desc,price,customCut}) =>{
    let index = -1;
    let res = db.products.filter((prd,i)=> {if(prd.itemKey==itemKey){index=i;return prd}})
    let product = {itemKey,desc,price,customCut};
    if(index>=0){
      db.products[index]=product;
    }else{
      db.products.push(product);
    }
    return product;
  },
  deleteProductByItemKey: ({itemKey}) =>{
    let index = -1;
    let res = db.products.filter((prd,i)=> {if(prd.itemKey==itemKey){index=i;return prd}})
    let {products} = db;
    if(index>=0){
       products.splice(index,1);
    }
    console.log(">>index",index)
    let dto={status:(index>=0)?true:false,"products":products} 
    db.products=products;
    return dto;
  }
};

const schema = buildSchema(`
  type Query {
    users: [User],
    products: [Product],
    productsByItemKey(itemKey:String):Product
  }
  type Mutation {
    createUser(name: String): User,
    updateProduct(itemKey:String!,desc: String,price: String,customCut: String ): Product,
    deleteProductByItemKey(itemKey:String!): DeleteResDto
  }
  type User {
    name: String
  }
  type Product{
    itemKey: String,
    desc: String,
    price: String,
    customCut: String 
  }
  type DeleteResDto{
    status:Boolean,
    products: [Product]
  }
`);

// Express stuff
app.use(cors())
  app.use(
    '/graphql',
    expressGraphQL({
      schema,
      rootValue: resolvers,
      graphiql: true,
    })
  )
  .listen(9000, () => {
    console.log('Visit: http://localhost:9000/graphql for GraphiQL');
  });
