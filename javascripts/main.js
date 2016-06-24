var parse = text => {
  try {
    return JSON.parse(text) || false;
  } catch (error) {
    return false;
  }
};
var debounce = function (func, wait, scope) {
  var timeout;
  return function () {
    var context = scope || this, args = arguments;
    var later = function () {
        timeout = null;
        func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

var content = document.querySelector('.shell');
var picktimediv = document.querySelector('.picktime');
var enddiv = document.querySelector('.end');
var tictic = document.querySelector('.tictic');
var textarea = document.querySelector('.mytextarea');
var records = parse(localStorage.getItem('barunku:records')) || {};
var thistime = {};
var date = new Date();
var key = [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate()
].join('-').replace(/\b\d\b/g, '0$&');

document.addEventListener('DOMContentLoaded', () => {
  var time = parse(localStorage.getItem('barunku:remaintime')) || 0;
  if (time) {
    textarea.value = localStorage.getItem('barunku:contenttemp');
    textarea.focus();
    tictok(time);
    textarea.addEventListener('keydown', debounce(delay, 60000, this));
  } else {
    pickTime();
  }
  window.onbeforeunload = function() {
    localStorage.setItem('barunku:contenttemp', textarea.value);
  };
});

var start = function (time) {
  thistime.time = time;
  tictok(time*60);
  picktimediv.style.display = 'none';
}

var tictok = function (time) {
  tictic.innerHTML = parseInt(time/60) + ':' + (time%60 + '').replace(/\b\d\b/g, '0$&');
  var t = setInterval(function() {
    if (time <= 0) {
      clearInterval(t);
      textarea.disabled = true;
      // 保存records
      thistime.words = textarea.value.length;
      if(!records[key]) records[key] = {};
      records[key] = {
        time: (records[key].time || 0) + thistime.time,
        words: (records[key].words || 0) + thistime.words
      };
      localStorage.setItem('barunku:records', JSON.stringify(records));
      // 临时保存数据并清空
      localStorage.setItem('barunku:contenttemp', textarea.value);
      // 提示用户
      enddiv.style.display = 'block';
    } else {
      localStorage.setItem('barunku:remaintime', --time);
      tictic.innerHTML = parseInt(time/60) + ':' + (time%60 + '').replace(/\b\d\b/g, '0$&');
    }
  }, 1000);
};

var pickTime = function () {
  textarea.value = '';
  picktimediv.style.display = 'block';
  enddiv.style.display = 'none';
};

var delay = function () {
  localStorage.setItem('barunku:contenttemp', textarea.value);
  textarea.classList.add('fadeout');
  setTimeout(() => {
    textarea.value = '';
    textarea.classList.remove('fadeout');
  }, 5000)
};
