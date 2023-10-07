// doc: https://k6.io/docs/using-k6/test-lifecycle/
// 1. init code

export function setup() {
    // 2. setup code
  }
  
  export default function (data) {
    // 3. VU code
  }
  
  export function teardown(data) {
    // 4. teardown code
  }
  