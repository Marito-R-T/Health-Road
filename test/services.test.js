const {validate_percentage, get_schedule}  = require('../routes/services')

//test1
test('validate discount.percentage equal true',()=>{
    expect(validate_percentage({})).toBe(true);
})

test('given a percentage of 90 equal to a valid range',()=>{
    expect(validate_percentage({
        percentage:90
    })).toBe(true);
})

test('given a percentage of 190 equal to a invalid range',()=>{
    expect(validate_percentage({
        percentage:190
    })).toBe(false);
})

test('given a percentage with a value of string equal false',()=>{
    expect(validate_percentage({
        percentage:'s'
    })).toBe(false);
})
//test2
test('given an empty schedule equal false',()=>{
    expect(get_schedule({})).toBe(false);
})

test('given an incomplete schedule equal false',()=>{
    expect(get_schedule(
        {
            "Monday":'1',
            "Tuesday":'0',
            "Thursday":'1',
            "Wednesday":'0',
        }
    )).toBe(false);
})

test('given an complete schedule equal a valid schedule',()=>{
    expect(get_schedule(
        {
            "Monday":'1',
            "Tuesday":'1',
            "Thursday":'1',
            "Wednesday":'1',
            "Friday":'1',
            "Sunday":'1',
            "Saturday":'0',
            "Start":'16:00',
            "End":'16:00'
        }
    )).toStrictEqual(
        {
            "Monday":'1',
            "Tuesday":'1',
            "Thursday":'1',
            "Wednesday":'1',
            "Friday":'1',
            "Sunday":'1',
            "Saturday":'0',
            "Start":'16:00',
            "End":'16:00'
        }
    );
})
