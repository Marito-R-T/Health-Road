const { Sequelize, DataTypes } = require('sequelize');


const USER = 'rougxvplrsupiu';
const HOST = 'ec2-54-209-52-160.compute-1.amazonaws.com';
const DATABASE = 'dcbbqpd0tlkl89';
const PASSWORD = 'b6dbf4d79e10aff839a37bfa1a078fbf70ffc7282ebf8ac81c05e229660911e2';
const PORT = '5432';

//connection
const sequelize = new Sequelize(
    'postgres://rougxvplrsupiu:b6dbf4d79e10aff839a37bfa1a078fbf70ffc7282ebf8ac81c05e229660911e2@ec2-54-209-52-160.compute-1.amazonaws.com:5432/dcbbqpd0tlkl89'
,
{
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

var hospital = sequelize.define('Hospital', {
    user: {
        type: DataTypes.STRING(length = 40),
        allowNull: false,
        primaryKey: true,
    },
   
    name: {
        type: DataTypes.STRING(length = 50),
        allowNull: false,
    },
    direction: {
        type: DataTypes.JSON,
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
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:true
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
    },deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    code:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
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
        allowNull: true,
    },
    profile_pic: {
        type: DataTypes.STRING(length = 50),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(length = 50),
        allowNull: true,
    },
    celphone: {
        type: DataTypes.INTEGER,
        allowNull:true
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
    },
    user: {
        type: DataTypes.STRING(length = 40),
        allowNull: false,
        primaryKey: true,
    },
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
    },
}, {
    freezeTableName: true,
})

var favorites = sequelize.define('Favorites', {
    user: {
        type: DataTypes.STRING(length = 40),
        allowNull: false,
    },
    service: {
        type: DataTypes.STRING(length = 30),
        allowNull: false,
    },
    hospital: {
        type: DataTypes.STRING(length = 30),
        allowNull: false,
    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue:true
    }
}, {
    freezeTableName: true,
})

var creditCard = sequelize.define('CreditCard', {
    card_number:{
        type: DataTypes.CHAR(length =17),
        allowNull: true,
        primaryKey: true,
    },
    expiration:{
        allowNull: false,
        type: DataTypes.DATEONLY
    },
    cvv:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    holder:{
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
    }
}, {
    freezeTableName: true,
})

var solicitudes = sequelize.define('Solicitudes', {
    name:{
        type: DataTypes.STRING(length = 50),
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING(length = 30),
        allowNull: false,
    },
    hospital_register:{
        type: DataTypes.STRING(length = 10),
        allowNull: false,
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    readed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
},{
    freezeTableName: true,
})
//solicitudes.sync({ force: true }).then(function() {});
//usuarios
//user.sync({ force: true }).then(function() {});
//ambulance_driver.sync({ force: true }).then(function() {});
//hospital.sync({ force: true }).then(function() {});
user.hasMany(ambulance_driver, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'user',
        primaryKey: true,
        allowNull: false,
    }
})
user.hasMany(hospital, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'user',
        primaryKey: true,
        allowNull: false,
    }
})

//-------servbicios
//category.sync({ force: true }).then(function() {});
//service.sync({ force: true }).then(function() {});
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
//discount.sync({ force: true }).then(function() {})
discount.hasMany(service, {
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: true,
    }
})

//rates
//service_rates.sync({ alter: true }).then(function() {})
service.hasMany(service_rates, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'service',
        allowNull: false,
    }
})

hospital.hasMany(service_rates, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'hospital',
        allowNull: false,
    }
})

//service_rates.sync({ alter: true }).then(function() {})

//favorites
user.hasMany(favorites, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'user',
        allowNull: false,
    }    
})

//favorites.sync({ alter: true }).then(function() {})

//CreditCard
user.hasOne(creditCard, {
    onDelete: 'CASCADE',
    foreignKey: {
        name:'user'
    }
})

hospital.hasMany(ambulance_driver,{
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull:true,
        defaultValue:null,
        name:'hospital_user'
    }
})


module.exports.sequelize = sequelize;
module.exports.hospital = hospital;
module.exports.service = service;
module.exports.ambulance_driver = ambulance_driver;
module.exports.user = user;
module.exports.category = category;
module.exports.service_rates = service_rates;
module.exports.discount = discount;
module.exports.favorites = favorites;
module.exports.creditCard = creditCard;