const chai = require("chai");
const assert = chai.assert;

const server = require("../server");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);

  suite("Integration tests with chai-http", function () {
    // #1
    test("Test GET /hello with no name", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello Guest");
          done();
        });
    });

    // #2
    test("Test GET /hello with your name", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello?name=Becky")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello Becky");
          done();
        });
    });

    // #3
    test('Send {surname: "Colombo"} with PUT /travellers', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({ surname: "Colombo" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
           assert.equal(
             res.body.name,
             "Cristoforo",
             'res.body.name should be "Christoforo"'
           );
           assert.equal(
             res.body.surname,
             "Colombo",
             'res.body.surname should be "Colombo"'
           );
          assert.equal(res.body.surname, "Colombo");
          done();
        });
    });

    // #4
    test('send {surname: "da Verrazzano"}', function (done) {
      /** place the chai-http request code here... **/
      chai
        .request(server)
        .put("/travellers")
        .send({ surname: "da Verrazzano" })
        /** place your tests inside the callback **/
        .end(function (err, res) {
          assert.equal(res.status, 200, "response status should be 200");
          assert.equal(res.type, "application/json", "Response should be json");
          assert.equal(res.body.name, "Giovanni");
          assert.equal(res.body.surname, "da Verrazzano");

          done();
        });
    });
  });
});

const Browser = require("zombie");

suite("Functional Tests with Zombie.js", function () {
  this.timeout(5000);

  const browser = new Browser();

  suite("Headless browser", function () {
    test('should have a working "site" property', function () {
      assert.isNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    browser.visit("http://localhost:3000", function () {
      // #5
      test('Submit the surname "Colombo" in the HTML form', function (done) {
        browser.fill("surname", "Colombo").pressButton("submit", function () {
          browser.assert.success();
          browser.assert.text("span#name", "Cristoforo");
          browser.assert.text("span#surname", "Colombo");
          browser.assert.element("span#dates", 1);

          done();
        });
      });


      // #6
      test('Submit the surname "Vespucci" in the HTML form', function (done) {
        browser.fill("surname", "Vespucci").pressButton("submit", function () {
          assert.include(browser.text("body"), "Vespucci");
          done();
        });
      });
    });
  });
});
