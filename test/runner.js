mocha.ui('tdd');
mocha.setup("bdd");
var assert = chai.assert,
    contontainer = document.getElementById("container"),

    origAssertEqual = assert.equal,
    origAssert = assert,
    origNotEqual = assert.notEqual,
    assertionCount = 0,
    assertions = document.createElement('em');



function init() {
  // assert extenders so that we can count assertions
  assert = function() {
    origAssert.apply(this, arguments);
    assertions.innerHTML = ++assertionCount;
  };
  assert.equal = function() {
    origAssertEqual.apply(this, arguments);
    assertions.innerHTML = ++assertionCount;
  };
  assert.notEqual = function() {
    origNotEqual.apply(this, arguments);
    assertions.innerHTML = ++assertionCount;
  };

  window.onload = function() {
    var mochaStats = document.getElementById('mocha-stats');

    if (mochaStats) {
      var li = document.createElement('li');
      var anchor = document.createElement('a');

      anchor.href = '#';
      anchor.innerHTML = 'assertions:';
      assertions.innerHTML = 0;

      li.appendChild(anchor);
      li.appendChild(assertions);
      mochaStats.appendChild(li);
    }
  };
}

var uid = 1000;
function createYchartContainer() {
    var div = document.createElement("div");
    var id = "ychartcontainer-"+uid++;
    div.style = "width: 900px; height: 300px;position: relative;";
    div.setAttribute("id",id);
    contontainer.appendChild(div);

    return id;
}





init();