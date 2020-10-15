/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

    // Sequelize connection options
    sequelize: {
        uri: 'mysql://root:password@localhost:3306/cms',
        options: {
            logging: false,
            operatorsAliases: false,
            define: {
                timestamps: false
            }

        },
        dialectOptions: {
            requestTimeout: 0
        }
    },

    // Seed database on startup
    seedDB: false,
};
