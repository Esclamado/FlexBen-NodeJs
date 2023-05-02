const request = require('supertest')
const app = require('../app')


beforeEach(() => {
    console.log('beforeEach');
});

afterEach(() => {
    console.log('afterEach');
});

// Expect Status Code 200
// test('Should login a user', async () => {
//     await request(app)
//         .post('/api/login/?email=blake.flowers@pointwest.com.ph&password=password123')
//         .expect(200)
// })


// Expect With Bad Status Code 
test('Should failed to login user', async () => {
    await request(app)
        .post('/api/login/?email=blake.flowers@pointwest.com.ph&password=password123')
        .expect(202)
})