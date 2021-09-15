const {Sequelize, DataTypes, Model} = require('sequelize');

//credentials
const USER='root';
const HOST='localhost';
const DATABASE='health_road'
const PASSWORD='Jhon$19PVT'
const PORT='3306'

//connection
const sequelize = new Sequelize(DATABASE,USER,PASSWORD,{
    HOST,
    PORT,
    dialect:'mysql',
    logging:false,
});

var hospital = sequelize.define('Hospital',{
    user:{
        type:DataTypes.STRING(length=60),
        allowNull:false,
        primaryKey:true,
    },
    password:{
        type:DataTypes.STRING(length=50),
        allowNull:false,
    },
    name:{
        type:DataTypes.STRING(length=50),
        allowNull:false,
    },
    direction:{
        type:DataTypes.STRING(length=100),
        allowNull:false,
    },
    profile_pic:{
        type:DataTypes.STRING(length=100),
        allowNull:false,
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    payment_type:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING(length=30),
        allowNull:false,
    },
    director_name:{
        type:DataTypes.STRING(length=50),
        allowNull:false,
    }
    },{
        freezeTableName: true,
    }
);

var service = sequelize.define('Service',{
        name:{
            type:DataTypes.STRING(length=30),
            allowNull:false,
            primaryKey:true,
        },
        price:{
            type:DataTypes.DOUBLE,
            allowNull:false,
        },
        description:{
            type:DataTypes.TEXT,
            allowNull:false,
        },
        status:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },

    },{
        freezeTableName: true,
    }
)

var category = sequelize.define('Category',{
    name:{
        type:DataTypes.STRING(length=30),
        allowNull:false,
        primaryKey:true,
    },
    description:{
        type:DataTypes.STRING(length=50),
        allowNull:false,
    }
    },{
        freezeTableName: true,
    }
);

var user = sequelize.define('User',{
    user:{
        type:DataTypes.STRING(length=40),
        allowNull:false,
        primaryKey:true,
    },
    password:{
        type:DataTypes.STRING(length=50),
        allowNull:false,
    },
    name:{
        type:DataTypes.STRING(length=40),
        allowNull:false,
    },
    last_name:{
        type:DataTypes.STRING(length=40),
        allowNull:false,
    },
    profile_pic:{
        type:DataTypes.STRING(length=50),
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING(length=50),
    },
    celphone:{
        type:DataTypes.INTEGER
    },
    rol:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
    },{
        freezeTableName: true
    }
);


category.hasMany(service,{onDelete: 'CASCADE',foreignKey:{
    name: 'category_name',
}});
hospital.hasMany(service,{onDelete: 'CASCADE',foreignKey:{
    name:'hospital_user',
    primaryKey:true,
}});


function create_tables(){
    hospital.sync({force:true}).then(function(){});
    category.sync({force:true}).then(function(){});
    service.sync({force:true}).then(function(){});
    user.sync({force:true}).then(function(){});
    
    
    
}

create_tables();
module.exports = sequelize;