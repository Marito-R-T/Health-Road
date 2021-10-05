const { Sequelize, DataTypes, Model } = require('sequelize');

//credentials
//const USER = '
//const USER = 'marito';
const USER = 'postgres';
const HOST = 'localhost';
const DATABASE = 'health_road';
//const PASSWORD = 'MrT26.';
const PASSWORD = 'Jhon$19PVT'
const PORT = '5432';

//connection
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    HOST,
    PORT,
    dialect: 'postgres',
    logging: false,
});

var hospital = sequelize.define('Hospital', {
    user: {
        type: DataTypes.STRING(length = 60),
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: DataTypes.STRING(length = 50),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(length = 50),
        allowNull: false,
    },
    direction: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    profile_pic: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    payment_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0
    },
    email: {
        type: DataTypes.STRING(length = 30),
        allowNull: false,
    },
    director_name: {
        type: DataTypes.STRING(length = 50),
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    photos: {
        type:DataTypes.JSON,
        
    }
}, {
    freezeTableName: true,
});

var service = sequelize.define('Service', {
    name: {
        type: DataTypes.STRING(length = 30),
        allowNull: false,
        primaryKey: true,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    schedule: {
        type: DataTypes.JSON,
        defaultValue: {
            "Monday":"0",
            "Tuesday":"0",
            "Thursday":"0",
            "Wednesday":"0",
            "Friday":"0",
            "Sunday":"0",
            "Saturday":"0"
        }
    }
}, {
    freezeTableName: true,
})

var category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING(length = 30),
        allowNull: false,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING(length = 50),
        allowNull: false,
    }
}, {
    freezeTableName: true,
});

var user = sequelize.define('User', {
    user: {
        type: DataTypes.STRING(length = 40),
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: DataTypes.STRING(length = 50),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(length = 40),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(length = 40),
        allowNull: false,
    },
    profile_pic: {
        type: DataTypes.STRING(length = 50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(length = 50),
    },
    celphone: {
        type: DataTypes.INTEGER
    },
    rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
    }
}, {
    freezeTableName: true
});

var ambulance_driver = sequelize.define('AmbulanceDriver', {
    direction: {
        type: DataTypes.JSON
    }
}, {
    freezeTableName: true
});

var service_rates = sequelize.define('ServiceRates', {
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true,
});

var discount = sequelize.define('Discount', {
    percentage:{
        type: DataTypes.DOUBLE,
        defaultValue:0,
        allowNull: false,
    },
    date_initial:{
        type:DataTypes.DATE,
        defaultValue: Date.now(),
    },
    date_end:{
        type:DataTypes.DATE,
        defaultValue: Date.now(),
    }
})

category.hasMany(service, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'category_name',
        allowNull:true
    }
});
hospital.hasMany(service, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'hospital_user',
        primaryKey: true,
    }
});
user.hasMany(ambulance_driver, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'user',
        primaryKey: true,
         allowNull: false,
    }
})
service.hasMany(service_rates, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'service',
        allowNull: false,
    }
})

discount.belongsTo(service,{
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'service_name',
    }
})

hospital.hasMany(discount,{
    onDelete: 'CASCADE',
    foreignKey: 'hospital_user'
})

function alter_table() {
    hospital.sync({ alter: true }).then(function() {});
    category.sync({ alter: true }).then(function() {});
    service.sync({ alter: true }).then(function() {});
    user.sync({ alter: true }).then(function() {});
    ambulance_driver.sync({ alter: true }).then(function() {});
    service_rates.sync({ alter: true }).then(function() {})
    discount.sync({ alter: true }).then(function() {})
}

function create_tables() {
    hospital.sync({ force: true }).then(function() {});
    category.sync({ force: true }).then(function() {});
    service.sync({ force: true }).then(function() {});
    user.sync({ force: true }).then(function() {});
    ambulance_driver.sync({ force: true }).then(function() {});
    discount.sync({ force: true }).then(function() {});
    //2021-09-16 12:29:43.541-06

}

//create_tables();
alter_table();
module.exports.sequelize = sequelize;
module.exports.hospital = hospital;
module.exports.service = service;
module.exports.ambulance_driver = ambulance_driver;
module.exports.user = user;
module.exports.category = category;
module.exports.service_rates = service_rates;
module.exports.discount = discount;