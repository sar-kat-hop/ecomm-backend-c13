// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
    foreignKey: 'id',
});

// Should a product only have one category?
// Product.hasOne(Category, {
//     foreignKey: 'id',
//     onDelete: 'CASCADE',
// });

// Categories have many Products
Category.hasMany(Product, {
    foreignKey: 'id',
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(ProductTag, {
    foreignKey: 'tag_id',
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(ProductTag, {
    foreignKey: 'product_id',
});

module.exports = {
    Product,
    Category,
    Tag,
    ProductTag,
};
