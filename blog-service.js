const Sequelize = require("sequelize");

var sequelize = new Sequelize('d608ek9sqr5d34', 'tegzhvvutmwwgv', 'ec6299b5f2073bfc1dbc6f8b03c3d314a0aa80b2aa9c67a1520010e8a6191c25', {
    host: 'ec2-54-152-28-9.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define("Post", {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
});

var Category = sequelize.define("Category", {
    category: Sequelize.STRING,
});

Post.belongsTo(Category, { foreignKey: "category" });

// open file and read data for posts and categories
module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        sequelize
            .sync()
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject("Una(ble to sync with the database");
            });
    });
};

// see all data for posts
module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {
        Post.findAll()
            .then(function(data) {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

// see published
module.exports.getPublishedPosts = function() {
    return new Promise((resolve, reject) => {
        Post.findAll({
                where: {
                    published: true,
                },
            })
            .then(function(data) {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

// see all data for categories
module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        Category.findAll()
            .then(function(data) {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.addPost = function(postData) {
    return new Promise((resolve, reject) => {
        postData.published = postData.published ? true : false;
        for (const p in postData) {
            if (`${postData[p]}` == "") {
                `postData.${p} = null`;
            }
        }
        postData.postDate = new Date();

        Post.create(postData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to create post");
            });
    });
};

module.exports.getPostsByCategory = function(category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
                where: {
                    category: category,
                },
            })
            .then(function(data) {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        const { gte } = Sequelize.Op;
        Post.findAll({
                where: {
                    postDate: {
                        [gte]: new Date(minDateStr),
                    },
                },
            })
            .then(function(data) {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getPostById = function(id) {
    return new Promise((resolve, reject) => {
        Post.findAll({
                where: {
                    id: id,
                },
            })
            .then(function(data) {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getPublishedPostsByCategory = function(category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
                where: {
                    published: true,
                    category: category,
                },
            })
            .then(function(data) {
                resolve(data);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.addCategory = function(categoryData) {
    return new Promise((resolve, reject) => {
        for (const c in categoryData) {
            if (`${categoryData[c]}` == "") {
                `categoryData.${c} = null`;
            }
        }
        Category.create(categoryData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to create category");
            });
    });
};

module.exports.deleteCategoryById = function(id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
                where: {
                    id: id,
                },
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to delete category");
            });
    });
};

module.exports.deletepostById = function(id) {
    return new Promise((resolve, reject) => {
        Post.destroy({
                where: {
                    id: id,
                },
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to delete post");
            });
    });
};