// import necessary module
import { check } from "k6";
import http from "k6/http";

// define configuration
export const options = {
  // define thresholds
  thresholds: {
    http_req_failed: [{threshold:'rate<0.1', abortOnFail: true}], // http errors should be less than 1%
    http_req_duration: [{threshold:"p(99)<1000", abortOnFail: true}], // 99% of requests should be below 1s
    checks: [{threshold:'rate>0.95', abortOnFail: true}],
  },
  scenarios: {
    // arbitrary name of scenario
    average_load: {
      executor: "ramping-vus",
      stages: [
        // ramp up to average load of 10 virtual users
        { duration: "2s", target: 10 },
        
      ],
    },
  }
};

export default function () {
  // define URL and payload
  const url = "http://localhost:4000/";
  //const url = "http://127.0.0.1:4000"
  const endpoint = "todos"
  const todoId = "todo-0"

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // GET todos
  const get_todos = {
    method: 'GET',
    url: url + endpoint
  };

  // GET todos/id
   const get_todo_by_id = {
    method: 'GET',
    url: url + endpoint + '/' + todoId
  };

  // POST todos (+ body)
  const create_todo = {
    method: 'POST',
    url: url + endpoint,
    body: {
      title: 'new_todo_',
      completed: 'false',
    },
    params: {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    },
  };

  // PUT todos/id
  const update_todo = {
    method: 'PUT',
    url: url + endpoint + '/' + todoId,
    body: {
      title: 'updated_todo_',
      completed: 'false',
    },
    params: {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    },
  };

  // DELETE todos/id
  const delete_todo = {
    method: 'DELETE',
    url: url + endpoint + '/' + todoId,
  }

  //const responses = http.batch([get_todos, get_todo_by_id, create_todo, update_todo, delete_todo]);
  const responses = http.batch([get_todos]);

  check(responses[0], {
    'Check status': (res) => res.status = 200,
    'Response time': (res) => res.timings.duration <= 400,
  });
  // Add tag to check
  //check(res, { 'status is 200': (r) => r.status === 200 }, { my_tag: "I'm a tag" });
}
