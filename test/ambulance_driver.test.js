const {get_values} = require('../routes/ambulance_driver')

//test3
test('given a null value equal to a empty json',()=>{
    expect(get_values(null)).toStrictEqual({});
})

test('given a json equal to a json without null values',()=>{
    expect(get_values({
        user:"isma",
        pk1: null,
        pk2: null,
        pk3: "0",
    })).toStrictEqual({
        pk3: "0",
    });
})

test('given a json without a user equal to a json without null values pk:0',()=>{
    expect(get_values({
        pk1: null,
        pk2: null,
        pk3: "0",
    })).toStrictEqual({
        pk3: "0",
    });
})