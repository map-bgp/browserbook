import { Link } from 'react-router-dom'
import { NavKey } from '../components/utils/constants'
import tokenCreation from '../images/token-creation.png'
import importToken from '../images/import-token.png'
import trade from '../images/trade.png'
import orderbook from '../images/orderbook.png'
import validator from '../images/validator.png'
import matched from '../images/matched.png'

const HowItWorks = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <article className="prose max-w-prose py-8 text-left">
        <p className="prose">
          Welcome. Browserbook is a decentralised token exchange that runs completely in your web
          browser. In the following paragraphs, we provide some a basic walkthrough on how to use the
          system in order to get up and running.
        </p>
        <h3>Connecting your Wallet</h3>
        <p className="prose">
          The first step is to connect your wallet by clicking the large "Connect" button in the header.
          When your wallet is connected you should see a green indicator light along with the word
          "Connected" up above. Be sure to set your Metamask to the correct network! If you're using the
          live version of this application, your wallet should be connected to the Polygon Mumbai
          Testnet. You will also need to obtain some MATIC from a Mumbai faucet like{' '}
          <a href="https://faucet.polygon.technology/" target="_blank">
            this one
          </a>
          .
        </p>
        <h3>Connecting to Other Peers</h3>
        <p className="prose">
          The application will automatically attempt to connect to other peers in the network in the
          background, and will display the amoutn of connected peers in the top right portion of the
          header. Don't have any connected peers? To evaluate the system, you can simulate your own
          connected peer by opening up a separate browser window. You should see the Peer Count jump by
          1! (If you're reading this page in a separate tab, you might have even already done this!)
        </p>
        <h3>Creating a Token</h3>
        <p className="prose">
          Let's create a token. Navigate to{' '}
          <Link to={`/${NavKey.TOKEN_ADMINISTRATION}`}>Token Administration</Link> and input a Unique
          Entity Identifier. Click "Create" and be sure to approve the transaction. Wait for the
          transaction to appove, and the UI should automatically update the page with your new entity
          details. Now you can create a token by inputting your token details into the provided form.
          Tokens can be either fungible or non-fungible. You can set the token supply for fungible
          tokens. Non-fungible tokens automatically have a supply of 1. Once again click "Create" and
          await the transaction to confirm. After the transaction confirms you should see your new token
          below. You can view the details you just provided and use the provided for to add a dividend,
          if you so choose.
        </p>
        <figure>
          <img
            className="w-full rounded-lg border-2 shadow-md"
            src={tokenCreation}
            alt=""
            width={1310}
            height={873}
          />
          <figcaption>The Token Creation Page</figcaption>
        </figure>
        <h3>Trading</h3>
        <p className="prose">
          The heart of our protocol is trading. To trade, navigate to the{' '}
          <Link to={`/${NavKey.TRADE}`}>Trade</Link> page and you will be presented with a form with all
          of the necessary details available for submitting an order.
          <br />
          <br />
          You should see the token you just created in the dropdown menu. If you did create a token in
          the previous step, there wont be any tokens to trade. You can either go back to the previous
          step and create your own token, or you can import a third party token. Even if you already
          created a token, let's use our other browser window we opened earlier to test this process so
          that we can simulate a trade later. Remember that in this browser you need Metamask installed,
          and be sure that the other browser window is connected to a <strong>different</strong> wallet,
          otherwise the system will read the chain and populate the site with the token you just created,
          as it belongs to the wallet you used to create it.
        </p>
        <h4>Importing a Third Party Token</h4>
        <p>
          In the other browser window, navigate to the "Tokens" submenu under the{' '}
          <Link to={`/${NavKey.TRADE}`}>Trade</Link> page. If you are correctly using a different wallet,
          you should see an empty page. This makes sense, as in this scenario we are simulating a second
          trader who has no idea that your token even exists! Let's remedy that now by importing the
          token we created previously. Simply click the "Add New Token" button at the top right of the
          content portion of the page. You should be presented with a small pop-up form where you can
          input the token details. In our case, input the entity URI you used when creating the token.
          The token ID is "1" in this case. (The first token you created in the main browser window)
        </p>
        <figure>
          <img
            className="w-full rounded-lg border-2 shadow-md"
            src={importToken}
            alt=""
            width={1310}
            height={873}
          />
          <figcaption>Importing a Third-party Token</figcaption>
        </figure>
        <h4>Depositing into the Exchange Contract</h4>
        <p>
          Alrighty, we are almost ready to simulate a trade! There are a few more steps we need to take
          before we're ready. Still in your second browser window, navigate to the "Balance" tab on the{' '}
          <Link to={`/${NavKey.TRADE}`}>Trade</Link> page. As a buyer, we need to submit an MATIC deposit
          to the exchange contract in order to purchase tokens on the marketplace. The exchange contract
          will send the seller our MATIC according to the details we specified in our order. How much
          exactly you would like to deposit depends on your supply of MATIC on the Mumbai Testnet. In any
          case, use the provided form to deposit enough to cover an order. Remember, because we are
          simulating a trade, this doesn't need to be much. Use a value of 0.05 if you don't have any
          preference. Once again, await the transaction confirmation. Check the Metamask pane if you need
          to to determine if the transaction has completed or not. Once it has, you should see the UI
          update with your new exchange balance.
        </p>
        <h4>Submitting a Buy Order</h4>
        <p>
          Okay, we are now ready to submit a buy order. Still in our second browser, navigate back to the
          "Trade" tab on the <Link to={`/${NavKey.TRADE}`}>Trade</Link> page. Because we imported our
          token that we created earlier, you should see the token available to trade in the dropdown
          menu. Let's go ahead and submit a buy order. Fill in the form with the following details:
        </p>
        <ul>
          <li>Token - The created token</li>
          <li>Order Type - Buy</li>
          <li>Unit Price - 0.0001</li>
          <li>Limit Price - 0.0001 </li>
          <li>Quantity - 100</li>
          <li>Expiry - 10 Hours and 30 Minutes</li>
        </ul>
        <p>
          The form will display a summary on the right hand side. Go ahead and click submit. You will be
          prompted for a signature request where you can view the programmatic representation of your
          order once again. Confirm the signature and voila! You just submitted an order to the
          decentralised network!
        </p>
        <figure>
          <img
            className="w-full rounded-lg border-2 shadow-md"
            src={trade}
            alt=""
            width={1310}
            height={873}
          />
          <figcaption>Submitting a Buy Order</figcaption>
        </figure>
        <h4>Viewing Orders</h4>
        <p>
          A couple of things just happened behind the scenes when we approved the signature request. The
          application took your order details and <em>signed</em> them. Thereafter it saved your order
          details in your local browser-based database and broadcast the order to all of the peers that
          it could find. If you kept your first browser window open, it should have received the order.
          Go back to your first browser window and click through to the{' '}
          <Link to={`/${NavKey.ORDER_BOOK}`}>Order Book</Link>. You should see the order from the "other"
          trader! (If you navigate to the Order Book back in the second browser, it won't show the order.
          That's because Order Book shows orders from <em>other</em> peers in the network. To view your
          own orders, click the "My Orders" tab on the <Link to={`/${NavKey.TRADE}`}>Trade</Link> page.)
        </p>
        <figure>
          <img
            className="w-full rounded-lg border-2 shadow-md"
            src={orderbook}
            alt=""
            width={1310}
            height={873}
          />
          <figcaption>Viewing the Orderbook</figcaption>
        </figure>
        <h4>Submitting a Sell Order</h4>
        <p>
          Alright let's go ahead and submit a sell order to match with the buy order in the decentralised
          orderbook. Back in the first browser, navigate to the "Trade" tab on the{' '}
          <Link to={`/${NavKey.TRADE}`}>Trade</Link> page. Submit a new order, this time with the
          following details:
        </p>
        <ul>
          <li>Token - The created token</li>
          <li>Order Type - Sell</li>
          <li>Unit Price - 0.0001</li>
          <li>Limit Price - Will automatically populate to the value of the Unit Price field </li>
          <li>Quantity - 100</li>
          <li>Expiry - 10 Hours and 30 Minutes</li>
        </ul>
        <p>
          We use the exact same details as before, except this time we are acting as the seller. When you
          click submit, the application will prompt you one time additional time before asking for a
          signature. It's asking you to grant <em>approval</em> to transfer the tokens on your behalf.
          You can think of this as the seller's equivalent of submitting a deposit, as we did with the
          buyer. This additional step only needs to be done once per token type. Once this transaction
          completes, Metamask will prompt you again for the actual order signature. Be patient as the
          initial transaction may take a few minutes to confirm. Once you have succesfully signed the
          order message, you should see the order in the "My Orders" tab. (You can also naturally switch
          back to your "other" trader in the second browser and see the order in the Order Book as well)
        </p>
        <h3>Validating Orders</h3>
        <p className="prose">
          Phew, that was a lot to take in! We successfully created a token, imported it, deposited some
          MATIC into the excahnge contract and submitted two orders from our "traders". Because we
          created both orders, we know that pricing and quantity details match up, and the orders have
          been propagated to both peers and are ready to be executed against one another. How do we
          execute the orders? <br />
          <br /> This is where validator nodes come in. Validator nodes watch the order book and attempt
          to submit matching orders to the chain on behalf of the traders. Validators pay the gas fees
          and in return receive a small commission on the order price. True to the decentralised nature
          of our protocol, anyone can become a validator node. Let's do that now. In your first browser,
          navigate to <Link to={`/${NavKey.ORDER_VALIDATION}`}>Order Validation</Link>.
        </p>
        <h4>Initialising the Validator Signer</h4>
        <p>
          In order to be a validator, we need to initialise a signer. A signer submits orders to the
          chain on behalf of the validator, so that validators don't need to manually approve every
          transaction or reveal their private key. In order to send orders to the chain, we need to
          deposit an initial amount of MATIC onto the signer so that the signer can cover the necessary
          gas fees. Let's do that now by filling out the form on the Order Validation page. Give your
          signer an initial balance of 0.01 MATIC and click "Create". You will be prompted for three
          different approvals by Metamask which:
        </p>
        <ul>
          <li>Requests your public encryption key in order to safely encrpyt your signer</li>
          <li>Saves the encrypted signer key safely on the blockchain so you can recover it later</li>
          <li>Sends the initial deposit to the signer</li>
        </ul>
        <p>
          Please be patient while the transactions confirm. (Sometimes when sunmitting multiple
          transactions a row a nonce error can occur. When this happens don't panic, just retry the
          transactions. If the creation succeeded but the deposit failed, you can also add a deposit by
          clicking "Open Siger Menu") Once completed you should see a page like the following:
        </p>
        <figure>
          <img
            className="w-full rounded-lg border-2 shadow-md"
            src={validator}
            alt=""
            width={1310}
            height={873}
          />
          <figcaption>The Validator Dashboard</figcaption>
        </figure>
        <h4>Matching Orders</h4>
        <p>
          Okay, our validator is set up. Let's go ahead and match some orders. Toggle the order matching
          algorithms in the background by clicking the toggle switch on the right hand side of the
          dashboard. You will be prompted to derypt a message by Metamask. This is a request to decrypt
          the signer key that we safely stored on the chain on your behalf. Only your wallet can decrypt
          this signer key, so your signer's funds are safe! Once the decryption is complete the order
          matching algorithms are firing up in the background. Not much seems like it's happening, but
          hopefully in a few moments you should see the "Transactions per Second" jump up from zero!
          Congratulations, you just matched some orders and committed them to the chain! (Curious users
          can open up the browser's console to see output from the matching algorithms)
        </p>
        <p>
          If you navigate back to "My Orders" in either browser, you should see that the orders have
          changed to the "Matched" status with a green indicator light. Furthermore, if you navigate to
          the "Tokens" tab under the <Link to={`/${NavKey.TRADE}`}>Trade</Link> page in your second
          browser (the buyer), you should see that the trader now has 100 tokens (You may need to refresh
          the page). Nice work!
        </p>
        <figure>
          <img
            className="w-full rounded-lg border-2 shadow-md"
            src={matched}
            alt=""
            width={1310}
            height={873}
          />
          <figcaption>The Buyer now has 100 Tokens</figcaption>
        </figure>
        <h3>Conclusion</h3>
        <p>
          That was crash course introduction to the basics of our protocol and application. We thank you
          for reading! Note that this application grew out of an academic work by three Computer Science
          students at the University of Zurich, and still has lots of room to grow! You can build your
          own version of this project or read a copy of our report by contacting the authors at the
          following <a href="https://github.com/map-bgp/browserbook">GitHub page.</a> Thanks for reading!
        </p>
        <h3>Advanced: Running a Performance Test</h3>
        <p className="prose">
          For developers, evaluators, and advanced users, we have also made available the option to run a
          performance test with the same performance testing framework that we describe in our report.
          Navigate to the <Link to={`/${NavKey.ORDER_VALIDATION}`}>Order Validation</Link> page and
          initialise the signer as normal if not already done so. Then click "Start Test". Then please{' '}
          <strong>wait</strong> for a short amount of time. If you open the console log, you will see
          that the application fills the orderbook with 1000 buy orders and 1000 sell orders. You can
          then turn on the signer as normal and await the orders to match. At the end of the run, the
          console will display the relevant statistics such as the running time, transactions per second,
          and how many orders succeeded or failed.
        </p>
        <p>
          <strong>Note:</strong>In order for the test to work, you need to correctly build the
          application from with the appropriate environment variables of the "traders" involved in the
          test:
        </p>
        <ul>
          <li>PERF_TEST_KEY_BUY</li>
          <li>PERF_TEST_KEY_SELL</li>
        </ul>
        <p>
          These environment variables MUST be set to private keys of addresses you control in your
          Metamask wallet. Additionally, the buyer address must have an appropriate amount of MATIC
          deposit in the Exchange contract, and the seller must have an appropriate number of the first
          token defined in the application's state. The system will prompt you via Metamask on the first
          time clicking "Start Test" to grant approval to exchange the seller's tokens (This is why the
          addresses must be available in your Metamask wallet). For all of these reasons, we highly
          recommend running the performance test on a local Hardhat blockchain, so that these
          considerations are much simpler. Nonetheless it is possible to run the performance test on the
          Mumbai Testnet. Contact the project maintainers for assistance if the above instructions leave
          any doubts.
        </p>
      </article>
    </div>
  )
}

export default HowItWorks
