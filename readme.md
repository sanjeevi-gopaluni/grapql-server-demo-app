sample graphql queries for this
{
 products {
    itemKey
     
  }
}
{
 productsByItemKey(itemKey:"322765") {
     itemKey
  }
}
mutation {
  createUser(name: "Green Fruits") {
    name
     
  }
}
mutation {
  updateProduct(itemKey: "30010098",desc:"abcd",price:"123") {
    itemKey
     
  }
}
 mutation{
  deleteProductByItemKey(itemKey:"30010098"){
    status,
    products{
      itemKey,desc,price,customCut
    }
  }
}
 
{
  products{
    itemKey,desc,price,customCut
  }
}