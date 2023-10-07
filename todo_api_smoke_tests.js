// import necessary module
import { check } from "k6";
import http from "k6/http";

// TODO: beforeEach() restore db to initial state 

// define configuration
export const options = {
  // define thresholds
  thresholds: {
    http_req_failed: [{threshold:'rate<0.01', abortOnFail: true}], // http errors should be less than 1%
    http_req_duration: [{threshold:"p(99)<1000", abortOnFail: true}], // 99% of requests should be below 1s
  },
  scenarios: {
    // arbitrary name of scenario
    average_load: {
      executor: "ramping-vus",
      stages: [
        // ramp up to average load of 10 virtual users
        { duration: "2s", target: 2 },
        
      ],
    },
  }
};

export default function () {
  // define URL and payload
  const url = "http://localhost:4000/api-docs";
  const endpoint = "/todos"
  const todoId = "0"

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

  // Add tag to check
  //check(res, { 'status is 200': (r) => r.status === 200 }, { my_tag: "I'm a tag" });
}
