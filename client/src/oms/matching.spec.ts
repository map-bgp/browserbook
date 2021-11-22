import {Matcher} from './matching';
import {OrderA, OrderB, OrderC,OrderD} from "./mock.order"
import {inspect} from 'util';

test('initalize the Matcher node', () => {
    const orderArray = [OrderA,OrderB,OrderC];

    const matcher = new Matcher(orderArray);
    matcher.initialTokenOrderlisting();
    matcher.populateTokenOrders();
    console.log(inspect(matcher.tokenWiseOrders));
    expect(matcher).toBeDefined();
  });