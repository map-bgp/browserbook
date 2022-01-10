import { Matcher } from "./matching";
import { OrderA, OrderB, OrderC, OrderD } from "./mock.order";
import { inspect } from "util";

test("initalize the OrderValidation node", () => {
  const orderArray = [OrderA, OrderB, OrderD, OrderC];

  const matcher = new Matcher(orderArray);
  matcher.initialOrderlisting().populateLiquidity();
  console.log(inspect(matcher.tokenWiseOrders));
  const result = matcher.processStarted();
  console.log(inspect(result));
  expect(matcher).toBeDefined();
});

// test('Test Orders compare', () => {
//     const orderArray = [OrderA,OrderB,OrderC,OrderD];
//     const matcher = new OrderValidation(orderArray);
//     console.log(matcher.orderCompare(OrderA,OrderB));
//     expect(matcher).toBeDefined();
//   });
