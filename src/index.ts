import { Observable, fromEvent, interval, Subject } from "rxjs";
import {
  map,
  throttle,
  distinctUntilChanged,
  debounceTime,
} from "rxjs/operators";
// import { interval } from "rxjs/observable/interval";

var observable = Observable.create((observer: any) => {
  observer.next("Hello World!");
  observer.next("Hello Again!");
  observer.complete();
  observer.next("Bye");
});
observable.subscribe(
  (x: any) => logItem(x),
  (error: any) => logItem("Error: " + error),
  () => logItem("Completed")
);
function logItem(val: any) {
  var node = document.createElement("li");
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById("list").appendChild(node);
}

var button = document.getElementById("clickButton");
var observer = {
  next: function (value: any) {
    logItem(value.clientX);
  },
  error: function (error: any) {
    logItem(error);
  },
  complete: function () {
    logItem("Completed!");
  },
};
var subs = Observable.create(function (obs: any) {
  button.onclick = function (event) {
    obs.next(event);
  };
}).subscribe(observer);

setTimeout(function () {
  subs.unsubscribe();
  console.log("Unsubscribed!");
  logItem("Unsubscribed!");
}, 10000);

//create observable that emits click events
const source = fromEvent(document, "click");
//map to string with given event timestamp
const example = source.pipe(
  map((event: any) => `Event time: ${event.timeStamp}`)
);
//output (example): 'Event time: 7276.390000000001'
const subscribe = example.subscribe((val) => console.log(val));

//Interval example
var observerInterval = {
  next: function (value: any) {
    logItem(value);
  },
};
var obsInterval = interval(1000)
  .pipe(
    map(function (value) {
      return "Interval value: " + value;
    }),
    throttle((val) => interval(2000))
  )
  .subscribe(observerInterval);
var unsub = document.getElementById("unsub");
unsub.onclick = function () {
  obsInterval.unsubscribe();
};

//Subjects
var subject = new Subject();
subject.subscribe({
  next: function (value: any) {
    logItem("From Subject: " + value);
  },
  error: function (error: any) {
    logItem("Error From Subject: " + error);
  },
  complete: function () {
    logItem("From Subject: Completed!");
  },
});
subject.next("new world order");
subject.error("new world order");

//OnChange send request logic: SEARCH
var input = document.getElementById("textInput");
var observableText = fromEvent(input, "input");
observableText
  .pipe(
    map((event: any) => event.target.value),
    debounceTime(500),
    distinctUntilChanged()
  )
  .subscribe({
    next: function (value: any) {
      logItem("From Text Input: " + value);
    },
  });
